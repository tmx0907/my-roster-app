import { Request, Response } from 'express';
import { extractTextFromImageBase64 } from '../services/vision.service';

export async function ocrHandler(req: Request, res: Response) {
  try {
    const { imageBase64 } = req.body as { imageBase64?: string };
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }
    const text = await extractTextFromImageBase64(imageBase64);
    return res.json({ text });
  } catch (err: any) {
    console.error('[OCR handler] error:', err);
    return res.status(500).json({ error: err.message ?? String(err) });
  }
}
