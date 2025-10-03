import { RosterEvent } from '@/types/roster';
import { BRISBANE_TZID, toAllDay } from './time';

const VTIMEZONE_AU_BNE = `BEGIN:VTIMEZONE
TZID:Australia/Brisbane
X-LIC-LOCATION:Australia/Brisbane
BEGIN:STANDARD
TZOFFSETFROM:+1000
TZOFFSETTO:+1000
TZNAME:AEST
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE`;

function fmtDtLocal(iso: string) {
  // iso like 2025-09-14T07:00:00+10:00 -> 20250914T070000
  const d = new Date(iso);
  const pad=(n:number)=>String(n).padStart(2,'0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
}

export function buildICS(events: RosterEvent[], calName='RosterFlow'): string {
  const now = new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+Z$/,'Z');
  const vevents = events.map(ev=>{
    const uid = `${ev.id}@rosterflow`;
    const lines = [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${now}`,
      ev.allDay
        ? `DTSTART;VALUE=DATE:${toAllDay(new Date(ev.start ?? new Date()))}`
        : `DTSTART;TZID=${BRISBANE_TZID}:${fmtDtLocal(ev.start!)}`,
      ev.allDay ? '' : `DTEND;TZID=${BRISBANE_TZID}:${fmtDtLocal(ev.end!)}`,
      `SUMMARY:${ev.title}`,
      ev.location ? `LOCATION:${ev.location}` : '',
      ev.notes ? `DESCRIPTION:${ev.notes.replace(/\n/g,'\\n')}` : '',
      'END:VEVENT'
    ].filter(Boolean);
    return lines.join('\n');
  }).join('\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RosterFlow//EN',
    `X-WR-CALNAME:${calName}`,
    VTIMEZONE_AU_BNE,
    vevents,
    'END:VCALENDAR'
  ].join('\n');
}

export function downloadICS(filename: string, ics: string) {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
  return url; // 모바일 자동 오픈용으로도 활용 가능
}
