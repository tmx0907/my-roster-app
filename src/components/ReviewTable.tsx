import React, { useMemo, useState } from 'react';
import { ParsedRoster, RosterEvent } from '@/types/roster';
import { buildICS, downloadICS } from '@/utils/ics';
import { detectOverlap } from '@/utils/time';

// Primary accent colour used throughout the review table UI.
const accent = '#718BBC';

/**
 * The ReviewTable component displays parsed roster events and allows the user
 * to adjust times, toggle all‑day status, and export the roster to an .ics
 * calendar file. The container has a fixed 1:1 aspect ratio to ensure a
 * consistent square layout.
 */
export default function ReviewTable({ parsed }: { parsed: ParsedRoster }) {
  // Provide a defensive fallback for the rows array. If parsed.events
  // happens to be undefined (e.g. due to a parsing failure), default
  // to an empty array so that downstream array operations like
  // `map` or `forEach` do not throw errors.
  const initialRows: RosterEvent[] = Array.isArray((parsed as any).events)
    ? (parsed as any).events
    : [];
  const [rows, setRows] = useState<RosterEvent[]>(initialRows);
  // Similarly, guard against undefined month/year values by
  // initialising selectedMonth/Year to undefined if they are not
  // provided. This prevents uncontrolled input warnings when using
  // these values as the `value` of a <select> element.
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(parsed.month ?? undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(parsed.year ?? undefined);

  // Compute validation errors for missing times and overlapping events.
  const errors = useMemo(() => {
    const errs: { row: number; msg: string }[] = [];
    // Ensure rows is always an array before iterating. Even if
    // initialRows was empty, the state may become undefined if
    // accidentally set elsewhere.
    const safeRows = Array.isArray(rows) ? rows : [];
    safeRows.forEach((r, idx) => {
      if (!r.allDay && (!r.start || !r.end)) {
        errs.push({ row: idx, msg: 'Missing start or end time' });
      }
    });
    for (let i = 0; i < safeRows.length; i++) {
      for (let j = i + 1; j < safeRows.length; j++) {
        if (detectOverlap(safeRows[i], safeRows[j])) {
          errs.push({ row: i, msg: 'Overlap' });
          errs.push({ row: j, msg: 'Overlap' });
        }
      }
    }
    return errs;
  }, [rows]);

  // Handler to update values on change.
  const onChange = (index: number, key: keyof RosterEvent, value: any) => {
    const copy = Array.isArray(rows) ? rows.slice() : [];
    (copy[index] as any)[key] = value;
    setRows(copy);
  };

  // Export the roster as an .ics file and trigger a download.
  const exportICS = () => {
    const ics = buildICS(rows);
    downloadICS('RosterFlow.ics', ics);
  };

  // Month/year dropdown options.
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const years = [2024, 2025, 2026];

  return (
    // Apply a square aspect ratio to the review table container
    <div
      style={{
        aspectRatio: '1 / 1',
        border: `2px solid ${accent}`,
        borderRadius: 12,
        padding: 16,
        background: '#F3F1EE',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Review &amp; Fix</h3>
        <button
          onClick={exportICS}
          style={{
            background: accent,
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Add to Calendar (.ics)
        </button>
      </div>

      {/* Show month/year selectors when detection fails */}
      {(!parsed.month || !parsed.year) && (
        <div style={{ marginBottom: 8 }}>
          <label>Month:&nbsp;</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value) || undefined)}
          >
            <option value="">--select--</option>
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
          &nbsp;
          <label>Year:&nbsp;</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value) || undefined)}
          >
            <option value="">--select--</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display validation errors */}
      {errors.length > 0 && (
        <div style={{ color: '#a66', marginBottom: 8 }}>
          {errors.map((err, idx) => (
            <div key={idx}>
              ⚠️ {err.msg} in row {err.row + 1}
            </div>
          ))}
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#E0D7DA' }}>
            <th>Title</th>
            <th>Start (ISO+10)</th>
            <th>End (ISO+10)</th>
            <th>All-day</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const hasErr = errors.some((e) => e.row === i);
            return (
              <tr key={r.id} style={{ background: hasErr ? '#fdd' : undefined }}>
                <td>
                  <input
                    value={r.title}
                    onChange={(e) => onChange(i, 'title', e.target.value)}
                  />
                </td>
                <td>
                  {r.allDay ? (
                    <input
                      type="date"
                      value={r.start?.substring(0, 10) || ''}
                      onChange={(e) =>
                        onChange(i, 'start', e.target.value + 'T00:00:00+10:00')
                      }
                    />
                  ) : (
                    <input
                      type="datetime-local"
                      value={r.start?.replace('+10:00', '') || ''}
                      onChange={(e) =>
                        onChange(i, 'start', e.target.value + '+10:00')
                      }
                    />
                  )}
                </td>
                <td>
                  {r.allDay ? (
                    <input
                      type="date"
                      value={r.end?.substring(0, 10) || ''}
                      onChange={(e) =>
                        onChange(i, 'end', e.target.value + 'T00:00:00+10:00')
                      }
                    />
                  ) : (
                    <input
                      type="datetime-local"
                      value={r.end?.replace('+10:00', '') || ''}
                      onChange={(e) =>
                        onChange(i, 'end', e.target.value + '+10:00')
                      }
                    />
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={!!r.allDay}
                    onChange={(e) => onChange(i, 'allDay', e.target.checked)}
                  />
                </td>
                <td>
                  <input
                    value={r.notes ?? ''}
                    onChange={(e) => onChange(i, 'notes', e.target.value)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
        Tip: On mobile devices, tapping the button opens the .ics file and adds the events
        to your default calendar.
      </div>
    </div>
  );
}