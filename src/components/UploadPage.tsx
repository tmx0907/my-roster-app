/*
 * UploadPage
 *
 * This page provides a focused interface for uploading a roster file.  It
 * reuses the RosterUploader component and adds small guidance text so
 * users know the supported file formats and size limits.  The colour
 * palette is kept consistent with the landing page by re‑defining the
 * same values here; feel free to extract these into a shared theme
 * module if preferred.
 */

import React from 'react';
import RosterUploader from './RosterUploader';

// Duplicate the palette from LandingPage for consistency.  In a larger
// application this could be shared via a theme context or imported from
// a constants module.
const COLOR_PALETTE = {
  background: '#EEE5DE',
  heroBg: '#F8F2EE',
  accent: '#D58BBD',
  text: '#385739',
};

export default function UploadPage() {
  // Callback to handle uploaded files.  You can replace this with your
  // actual OCR and calendar sync logic.
  const handleUpload = (file: File) => {
    console.log('Uploaded file:', file);
  };

  return (
    <div style={{ backgroundColor: COLOR_PALETTE.background, color: COLOR_PALETTE.text, minHeight: '100vh', padding: '4rem 1rem' }}>
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          backgroundColor: COLOR_PALETTE.heroBg,
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Upload your roster</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          No more printing schedules—your events will be at your fingertips.
        </p>
        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
          Files up to 5&nbsp;MB. Accepted formats: PDF, JPEG, PNG.
        </p>
        <RosterUploader onUpload={handleUpload} />
      </div>
    </div>
  );
}