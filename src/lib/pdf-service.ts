
'use client';
import { jsPDF } from 'jspdf';

/**
 * Generates an optimized PDF from front and back images.
 */
export async function generateOptimizedPDF(frontBase64: string, backBase64: string): Promise<string> {
  // Using jsPDF for client-side generation
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const availableWidth = pageWidth - margin * 2;
  const slotHeight = (pageHeight - margin * 3) / 2;

  // Function to add image to PDF maintaining aspect ratio
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
        doc.addImage(base64, 'JPEG', xOffset, yPos, drawWidth, drawHeight, undefined, 'FAST');
        resolve();
      };
      img.src = base64;
    });
  };

  // Add Front
  await addImageToDoc(frontBase64, margin);
  
  // Add Back
  await addImageToDoc(backBase64, margin * 2 + slotHeight);

  return doc.output('datauristring');
}

/**
 * Simple helper to convert File to Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
