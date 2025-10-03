import React, { useState } from 'react';

// 파일을 base64로 변환하는 유틸
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function OCRUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setText('');
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  }

  async function handleExtract() {
    if (!file) return;
    setLoading(true);
    try {
      const b64 = await fileToBase64(file);
      const [, base64] = b64.split(',');
      const res = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await res.json();
      setText(data.text || '');
    } catch (err) {
      console.error('OCR error:', err);
      setText('Error extracting text');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-4">
      <h3 className="text-xl font-semibold">Upload roster screenshot</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="cursor-pointer"
      />
      <button
        onClick={handleExtract}
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Processing…' : 'Extract text'}
      </button>
      {text && (
        <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap overflow-x-auto">
          {text}
        </pre>
      )}
    </div>
  );
}
