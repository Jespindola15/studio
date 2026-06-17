'use server';
/**
 * @fileOverview Flow to detect side and bounding box of a document for auto-cropping.
 * Includes enhanced prompt instructions for precise edge detection and retry logic.
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
  }).optional().describe('The precise bounding box of the document card itself, excluding any background.'),
  reasoning: z.string().describe('Short explanation of why it was classified and cropped as such.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

export async function analyzeDocumentSide(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDocumentPrompt',
  input: { schema: AnalyzeDocumentInputSchema },
  output: { schema: AnalyzeDocumentOutputSchema },
  prompt: `You are an expert document vision AI specialized in high-precision document scanning. 

Your task is to analyze the provided image and extract the exact coordinates of the physical ID document or card.

INSTRUCTIONS:
1. DETECT SIDE: Identify if it's the FRONT or BACK of a personal ID.
   - FRONT clues: Portrait photo, name, logo, chip.
   - BACK clues: MRZ code (<<<<), barcodes, signature strip.

2. PRECISE CROPPING (CRITICAL): 
   - Identify the FOUR CORNERS of the ID card.
   - The bounding box must include the ENTIRE card and ONLY the card.
   - EXCLUDE strictly: tables, hands, fingers holding the card, shadows, and any background.
   - If the card is rotated, provide the smallest upright bounding box that fully contains it.
   - Return normalized coordinates (0-1000) relative to the image dimensions.

3. REASONING: Briefly explain your detection.

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
        
        // Safety check for unrealistic bounding boxes
        if (output.boundingBox) {
          const { width, height } = output.boundingBox;
          if (width < 50 || height < 50) {
             console.warn('AI detected a suspicious document size, ignoring crop.');
             delete output.boundingBox;
          }
        }

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
