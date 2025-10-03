/**
 * Parser utility for extracting roster information from a variety of
 * Queensland Health roster formats.
 *
 * This module normalises different input shapes (strings, arrays of
 * objects, etc.) into a single text blob, then tokenises that text to
 * reconstruct individual roster entries. It supports rosters that
 * specify explicit time ranges as well as those that only provide
 * shift codes (e.g. “E”, “L”, “N‑TLD”, “Sick L”).
 */

export interface RosterEntry {
  date: string;
  name: string;
  start: string;
  end: string;
}

/**
 * Normalise various types of input into a single string. Depending on
 * how the roster is extracted, it may arrive as a string, an array of
 * page objects, or an object with a `text` property. This helper
 * attempts to flatten common structures into a plain string for parsing.
 *
 * @param input The raw data representing the roster.
 */
function normaliseToString(input: unknown): string {
  if (typeof input === 'string') {
    return input;
  }
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'text' in item) {
          const maybeText = (item as Record<string, unknown>).text;
          return typeof maybeText === 'string' ? maybeText : '';
        }
        return '';
      })
      .join('\n');
  }
  if (input && typeof input === 'object' && 'text' in (input as object)) {
    const maybeText = (input as Record<string, unknown>).text;
    return typeof maybeText === 'string' ? maybeText : '';
  }
  return '';
}

/**
 * Parse a roster from raw data. Handles both PDFs that contain
 * explicit time ranges and rosters that only specify shift codes.
 *
 * @param raw The raw text or structured data representing the roster.
 * @returns An array of structured roster entries.
 */
export function parseRoster(raw: unknown): RosterEntry[] {
  const text = normaliseToString(raw);
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const tokens: string[] = [];
  lines.forEach((line) => {
    const normalised = line.replace(/[–—]/g, '-');
    normalised.split(/\s+/).forEach((piece) => {
      const match = piece.match(/^(\d{3,4})-(\d{3,4})$/);
      if (match) {
        tokens.push(match[1]);
        tokens.push('-');
        tokens.push(match[2]);
      } else {
        tokens.push(piece);
      }
    });
  });

  const roster: RosterEntry[] = [];
  let i = 0;

  // Words that should not be included in staff names
  const skipWords = new Set([
    'available',
    'for',
    'night',
    'shifts',
    'shift',
    'availablefornightshifts',
  ]);

  while (i < tokens.length) {
    const token = tokens[i];

    // Identify the date (1–2 digits). Skip anything that isn't a date.
    if (!/^\d{1,2}$/.test(token)) {
      i++;
      continue;
    }
    const date = token.padStart(2, '0');
    i++;

    // Build up the name, skipping filler words
    const nameParts: string[] = [];
    while (i < tokens.length && !/^\d{3,4}$/.test(tokens[i])) {
      if (tokens[i] === '-') {
        break;
      }
      // Stop if next token looks like the start of another entry (a new date)
      if (/^\d{1,2}$/.test(tokens[i])) {
      break;
      }
      const word = tokens[i];
      if (!skipWords.has(word.toLowerCase())) {
        nameParts.push(word);
      }
      i++;
    }
    const name = nameParts.join(' ').trim();

    // Extract start and end times if present
    let start = '';
    if (i < tokens.length && /^\d{3,4}$/.test(tokens[i])) {
      start = tokens[i];
      i++;
    }
    if (i < tokens.length && tokens[i] === '-') {
      i++;
    }
    let end = '';
    if (i < tokens.length && /^\d{3,4}$/.test(tokens[i])) {
      end = tokens[i];
      i++;
    }

    // Save entry if it has either a complete time range or at least a name/date
    if (date && name && start) {
      roster.push({ date, name, start, end });
    } else if (date && name) {
      const lowerName = name.toLowerCase();
      const isAvailability = lowerName.includes('available for night');
      const isNotes = lowerName.startsWith('notes:');
      if (!isAvailability && !isNotes) {
        roster.push({ date, name, start: '', end: '' });
      }
    }
  }

  return roster;
}
