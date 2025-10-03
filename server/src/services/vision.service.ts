import vision from '@google-cloud/vision';

/**
 * Vision 클라이언트를 초기화합니다.  
 * Vercel에 배포할 때는 `GOOGLE_APPLICATION_CREDENTIALS_JSON` 환경변수에
 * 서비스 계정 JSON 전체를 넣으면 됩니다.  
 * 로컬에서는 `GOOGLE_APPLICATION_CREDENTIALS`에 키 파일 경로를 지정하면 됩니다.
 */
function makeVisionClient() {
  const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (raw && raw.trim().startsWith('{')) {
    const credentials = JSON.parse(raw);
    return new vision.ImageAnnotatorClient({ credentials });
  }
  return new vision.ImageAnnotatorClient();
}

const client = makeVisionClient();

export async function extractTextFromImageBase64(base64: string): Promise<string> {
  const [result] = await client.documentTextDetection({
    image: { content: base64 },
  });
  if (result.error?.message) {
    throw new Error(result.error.message);
  }
  return result.fullTextAnnotation?.text ?? '';
}

