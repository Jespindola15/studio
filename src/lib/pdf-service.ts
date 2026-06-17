'use client';
import { jsPDF } from 'jspdf';

/**
 * Crops a base64 image based on normalized coordinates (0-1000)
 */
export async function cropImage(
  base64: string,
  box: { x: number; y: number; width: number; height: number }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject('No canvas context');

      // Convert normalized to pixel coordinates
      const sx = (box.x / 1000) * img.width;
      const sy = (box.y / 1000) * img.height;
      const sw = (box.width / 1000) * img.width;
      const sh = (box.height / 1000) * img.height;

      canvas.width = sw;
      canvas.height = sh;

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    img.onerror = reject;
    img.src = base64;
  });
}

/**
 * Generates an optimized PDF from front and back images.
 */
export async function generateOptimizedPDF(frontBase64: string, backBase64: string): Promise<string> {
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

  await addImageToDoc(frontBase64, margin);
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
