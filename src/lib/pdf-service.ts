'use client';
import { jsPDF } from 'jspdf';

/**
 * Genera un PDF optimizado a partir de las imágenes del frente y el dorso.
 * Utiliza formato PNG para mantener la máxima calidad.
 */
export async function generateOptimizedPDF(frontBase64: string, backBase64: string): Promise<string> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const availableWidth = pageWidth - margin * 2;
  const slotHeight = (pageHeight - margin * 3) / 2;

  const addImageToDoc = async (base64: string, yPos: number) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const imgRatio = img.width / img.height;
        let drawWidth = availableWidth;
        let drawHeight = drawWidth / imgRatio;

        if (drawHeight > slotHeight) {
          drawHeight = slotHeight;
          drawWidth = drawHeight * imgRatio;
        }

        const xOffset = margin + (availableWidth - drawWidth) / 2;
        
        doc.addImage(base64, 'PNG', xOffset, yPos, drawWidth, drawHeight, undefined, 'MEDIUM');
        resolve();
      };
      img.src = base64;
    });
  };

  await addImageToDoc(frontBase64, margin);
  await addImageToDoc(backBase64, margin * 2 + slotHeight);

  return doc.output('datauristring');
}

/**
 * Convierte un archivo File a Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}