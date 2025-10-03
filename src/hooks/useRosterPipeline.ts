import { useCallback, useState } from 'react';
import { extractPdfLines } from '@/utils/pdf';
import { ocrFileToText } from '@/utils/ocr';
import { parseRoster } from '@/utils/parser';
import { ParsedRoster } from '@/types/roster';

export type PipelineStage = 'idle' | 'extracting' | 'parsing' | 'review';

/**
 * useRosterPipeline orchestrates the upload flow for roster files.  It manages
 * asynchronous extraction (PDF or OCR), parsing and error handling.  After
 * calling processFile with a File, the hook exposes the current stage and
 * parsed result.  See parseRoster for the actual roster parsing logic.
 */
export function useRosterPipeline() {
  /**
   * stage describes the current pipeline state: idle, extracting (reading PDF
   * or running OCR), parsing (converting text into events), or review when
   * parsing is complete.  progress tracks OCR progress between 0–1.
   */
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ParsedRoster | null>(null);
  const [error, setError] = useState<string | undefined>();

  /**
   * processFile kicks off the roster ingestion pipeline.  It attempts to
   * extract text directly from PDFs for speed; if that fails or the file
   * isn’t a PDF, OCR is invoked.  Extracted text is normalised into an
   * array of trimmed non‑empty lines which are then parsed into events via
   * parseRoster.
   */
  const processFile = useCallback(async (file: File) => {
    setStage('extracting');
    setProgress(0);
    setError(undefined);
    try {
      let lines: string[] = [];
      if (file.type === 'application/pdf') {
        // Attempt native PDF text extraction first.
        try {
          lines = await extractPdfLines(file);
        } catch {
          // Fallback to OCR for scanned PDFs or failed extraction.  Provide a
          // progress callback to update the UI.
          const text = await ocrFileToText(file, p => setProgress(p));
          lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
        }
      } else {
        // For images and other formats use OCR directly.
        const text = await ocrFileToText(file, p => setProgress(p));
        lines = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      }
      setStage('parsing');
      const parsed = parseRoster(lines);
      setResult(parsed);
      setStage('review');
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setStage('idle');
    }
  }, []);

  return {
    stage,
    progress,
    result,
    error,
    processFile,
    /**
     * reset brings the pipeline back to the idle state and clears previous
     * parsing results.
     */
    reset: () => {
      setStage('idle');
      setResult(null);
    },
  };
}