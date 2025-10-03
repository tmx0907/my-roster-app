import express from 'express';
import cors from 'cors';
import ocrRoutes from './routes/ocr.routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', ocrRoutes);

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
