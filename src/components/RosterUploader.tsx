import React from 'react';
import { useRosterPipeline } from '@/hooks/useRosterPipeline';
import ReviewTable from './ReviewTable';

/**
 * RosterUploader is the entry component for uploading and reviewing roster files.
 *
 * The outermost <div> applies a 1:1 aspect ratio so that this component always
 * renders within a square. This makes the layout predictable regardless of
 * screen width or height.
 */
export default function RosterUploader() {
  const { stage, result, error, processFile, reset } = useRosterPipeline();

  // Handle file input changes. When a file is selected, start processing it.
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  return (
    // Apply a square aspect ratio to the entire uploader
    <div style={{ aspectRatio: '1 / 1' }}>
      <div className="electric-border" style={{ padding: 16 }}>
        {/* Updated instructions for uploading and a custom file input trigger */}
        <label style={{ fontWeight: 600 }}>Upload your roster</label>
        <br />
        {/* Hidden native file input */}
        <input
          id="rosterFile"
          type="file"
          accept=".pdf,image/*"
          onChange={onFile}
          style={{ display: 'none' }}
        />
        {/* Custom styled label acting as the file chooser button */}
        <label
          htmlFor="rosterFile"
          style={{
            display: 'inline-block',
            marginTop: 8,
            padding: '0.5rem 1rem',
            backgroundColor: '#D58BBD',
            color: '#fff',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Choose File
        </label>
        {/* File size and type guidance */}
        <p style={{ fontSize: '0.75rem', color: '#555', marginTop: 4 }}>
          Max 5 MB  |  Formats: PDF, JPEG, PNG
        </p>
        {error && <div style={{ color: '#a00', marginTop: 8 }}>Error: {error}</div>}
        {stage !== 'idle' && <div style={{ marginTop: 8 }}>Progress: {stage}</div>}
      </div>

      {stage === 'review' && result && (
        <div style={{ marginTop: 16 }}>
          <ReviewTable parsed={result} />
        </div>
      )}
    </div>
  );
}
