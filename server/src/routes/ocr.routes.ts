import { Router } from 'express';
import { ocrHandler } from '../controllers/ocr.controller';

const router = Router();
router.post('/ocr', ocrHandler);

export default router;
