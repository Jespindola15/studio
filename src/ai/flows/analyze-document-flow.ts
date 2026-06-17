'use server';
/**
 * @fileOverview Flow to detect document side and perform background removal using AI.
 * Uses Gemini 2.5 Flash Image to isolate the document from the background.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeDocumentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a document as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDocumentInput = z.infer<typeof AnalyzeDocumentInputSchema>;

const AnalyzeDocumentOutputSchema = z.object({
  side: z.enum(['front', 'back', 'unknown']).describe('The detected side of the document.'),
  croppedPhotoDataUri: z.string().optional().describe('The document image with the background completely removed.'),
  reasoning: z.string().describe('Explanation of the detection and processing.'),
});
export type AnalyzeDocumentOutput = z.infer<typeof AnalyzeDocumentOutputSchema>;

export async function analyzeDocumentSide(input: AnalyzeDocumentInput): Promise<AnalyzeDocumentOutput> {
  return analyzeDocumentFlow(input);
}

const analyzeDocumentFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentFlow',
    inputSchema: AnalyzeDocumentInputSchema,
    outputSchema: AnalyzeDocumentOutputSchema,
  },
  async (input) => {
    // We use the specialized image-to-image model for background removal
    // and the base model for structured analysis.
    
    // 1. Analysis Step (Textual)
    const analysisResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: [
        { media: { url: input.photoDataUri } },
        { text: 'Analyze this document. Identify if it is the FRONT or BACK. FRONT usually has a photo/chip. BACK usually has barcodes/MRZ. Provide reasoning.' }
      ],
      output: { schema: z.object({ side: z.enum(['front', 'back', 'unknown']), reasoning: z.string() }) }
    });

    const analysis = analysisResponse.output;

    // 2. Background Removal Step (Image-to-Image)
    // We request the model to isolate the document.
    let croppedPhotoDataUri: string | undefined;
    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image',
        prompt: [
          { media: { url: input.photoDataUri } },
          { text: 'Generate a new image containing ONLY the document card. Remove the entire background, including tables, hands, and shadows. Crop precisely to the document edges and straighten it if it is tilted. The result should look like a flat, clean scan.' },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (media?.url) {
        croppedPhotoDataUri = media.url;
      }
    } catch (error) {
      console.error('Failed to remove background with AI:', error);
      // Fallback: use the original image if AI cropping fails
    }

    return {
      side: analysis?.side || 'unknown',
      reasoning: analysis?.reasoning || 'No se pudo analizar el documento.',
      croppedPhotoDataUri: croppedPhotoDataUri || input.photoDataUri,
    };
  }
);
