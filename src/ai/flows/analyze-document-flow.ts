'use server';
/**
 * @fileOverview Flow to detect document side and perform surgical background removal using AI.
 * Uses Gemini 2.5 Flash for metadata and Gemini 2.5 Flash Image for precise document isolation.
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
    // 1. Step: Metadata Analysis (Detecting Front or Back)
    let side: 'front' | 'back' | 'unknown' = 'unknown';
    let reasoning = 'No se pudo determinar el lado.';

    try {
      const analysisResponse = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: [
          { media: { url: input.photoDataUri } },
          { text: 'Analiza este documento. Identifica si es el FRENTE (con foto/chip/datos principales) o el DORSO (con códigos de barras/MRZ/firmas). Responde en formato JSON con los campos "side" (front/back/unknown) y "reasoning".' }
        ],
        output: { 
          schema: z.object({ 
            side: z.enum(['front', 'back', 'unknown']), 
            reasoning: z.string() 
          }) 
        }
      });

      if (analysisResponse.output) {
        side = analysisResponse.output.side;
        reasoning = analysisResponse.output.reasoning;
      }
    } catch (e) {
      console.error('Side detection error:', e);
    }

    // 2. Step: Surgical Background Removal & Document Isolation
    let croppedPhotoDataUri: string | undefined;
    
    try {
      const imageResponse = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image',
        prompt: [
          { media: { url: input.photoDataUri } },
          { text: `[CONTEXTO]
Eres un módulo especializado en visión por computadora y procesamiento de imágenes para una aplicación de gestión de documentos personales.

[TAREA]
Tu único objetivo es aislar el documento de identidad principal (DNI/Credencial) que aparece en la imagen proporcionada, eliminando por completo todo el fondo circundante (superficies, sombras externas, texturas de papel de apoyo o mesas).

[INSTRUCCIONES DE PROCESAMIENTO]
1. Identificación del Objeto: Localiza los cuatro bordes (esquinas redondeadas) de la tarjeta de identificación plástica.
2. Segmentación de Fondo: Remueve de manera precisa todo elemento ajeno al documento. Asegúrate de recortar limpiamente las sombras proyectadas en los bordes para evitar contornos oscuros no deseados.
3. Máscara de Transparencia: Aplica un canal alfa (transparencia) en el área remanente externa al documento. El resultado debe ser exclusivamente el documento.
4. Enderezado: Aplica una transformación de perspectiva (warp perspective) para enderezar el documento de forma frontal y perfectamente rectangular. El resultado debe parecer un escaneo plano.

[FORMATO DE SALIDA]
Devuelve exclusivamente la imagen recortada en alta resolución (formato PNG con transparencia si es posible), manteniendo la nitidez original de los datos legibles dentro del documento. No agregues texto explicativo ni metadatos adicionales en la respuesta visual.` },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      if (imageResponse.media?.url) {
        croppedPhotoDataUri = imageResponse.media.url;
      }
    } catch (error) {
      console.error('Image processing error:', error);
    }

    return {
      side,
      reasoning,
      croppedPhotoDataUri: croppedPhotoDataUri || input.photoDataUri,
    };
  }
);
