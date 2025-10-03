// npm i pdfjs-dist
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';
GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractPdfLines(file: File): Promise<string[]> {
  const ab = await file.arrayBuffer();
  const doc = await getDocument({ data: ab }).promise;
  const lines: string[] = [];
  for (let p=1; p<=doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const joined = content.items.map((i:any)=>('str' in i ? i.str : '')).join('\n');
    lines.push(...joined.split(/\r?\n/).map(s=>s.trim()).filter(Boolean));
  }
  await doc.destroy();
  return lines;
}
