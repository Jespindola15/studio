'use server';
/**
 * @fileOverview Flow to detect side and bounding box of a document for auto-cropping.
 * Includes retry logic to handle transient 503 Service Unavailable errors.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeDocumentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

const AnalyzeDocumentOutputSchema = z.object({
  side: z.enum(['front', 'back', 'unknown']).describe('The detected side of the document.'),
  confidence: z.number().describe('Confidence score from 0 to 1.'),
  documentType: z.string().optional().describe('Type of document detected (e.g. ID, Passport, Driver License).'),
  boundingBox: z.object({
    x: z.number().describe('Normalized x coordinate of the top-left corner (0-1000).'),
    y: z.number().describe('Normalized y coordinate of the top-left corner (0-1000).'),
    width: z.number().describe('Normalized width of the document (0-1000).'),
    height: z.number().describe('Normalized height of the document (0-1000).'),
  }).optional().describe('The precise bounding box of the ID card/document within the photo.'),
  reasoning: z.string().describe('Short explanation of why it was classified as such.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

export async function analyzeDocumentSide(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentPrompt',
  input: { schema: AnalyzeDocumentInputSchema },
  output: { schema: AnalyzeDocumentOutputSchema },
  prompt: `You are an expert document analysis AI. 
Analyze the image and:
1. Determine if it is the FRONT or BACK of a personal identification document.
2. Find the PRECISE BOUNDING BOX of the document itself, excluding the background (table, hands, etc.).
3. Return normalized coordinates (0-1000) for x, y, width, and height.

Visual Cues for FRONT: Portrait photo, full name, national emblems.
Visual Cues for BACK: MRZ (<<<< text), barcodes, QR codes, magnetic stripes.

Photo: {{media url=photoDataUri}}`,
});

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async (input) => {
    const MAX_RETRIES = 3;
    let lastError;

    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        const { output } = await prompt(input);
        if (!output) throw new Error('AI failed to analyze document');
        return output;
      } catch (error: any) {
        lastError = error;
        const isTransient = error?.message?.includes('503') || error?.message?.includes('429') || error?.message?.includes('UNAVAILABLE');
        
        if (isTransient && i < MAX_RETRIES - 1) {
          const delay = 1500 * (i + 1);
          console.warn(`AI model busy (503/429). Retry attempt ${i + 1}/${MAX_RETRIES} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error('AI analysis failed after multiple retries.');
  }
);
