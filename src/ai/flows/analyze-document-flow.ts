
'use server';
/**
 * @fileOverview Flow to detect if an image is the front or back of a document.
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
Analyze the provided image and determine if it is the FRONT or BACK of a personal identification document (ID card, Driver's License, etc.).

Visual Cues for FRONT:
- Presence of a portrait photo.
- Full name, birth date, signature.
- National emblems or holograms.

Visual Cues for BACK:
- Machine Readable Zone (MRZ) - text blocks at bottom with lots of '<<<<'.
- Barcodes or QR codes.
- Magnetic stripes.
- Address info or emergency contacts.

Photo: {{media url=photoDataUri}}`,
});

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to analyze document');
    return output;
  }
);
