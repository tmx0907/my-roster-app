// npm i tesseract.js
import Tesseract from 'tesseract.js';

export async function ocrFileToText(file: File, onProgress?: (p:number)=>void): Promise<string> {
  const worker = await Tesseract.createWorker('eng', 1, {
    logger: m => onProgress?.(m.progress ?? 0)
  });
  try {
    const { data } = await worker.recognize(await file.arrayBuffer() as any);
    return data.text;
  } finally {
    await worker.terminate();
  }
}
