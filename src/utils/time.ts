import { RosterEvent } from '@/types/roster';
export const BRISBANE_TZID = 'Australia/Brisbane' as const;
const BRISBANE_OFFSET = '+10:00'; // no DST

export function isoAEST(date: Date, h: number, m: number) {
  const y = date.getFullYear(), mo = date.getMonth() + 1, d = date.getDate();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}-${pad(mo)}-${pad(d)}T${pad(h)}:${pad(m)}:00${BRISBANE_OFFSET}`;
}
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate()+n);
export function makeId() { return Math.random().toString(36).slice(2,10); }
export function toAllDay(date: Date) {
  const y=date.getFullYear(), m=date.getMonth()+1, d=date.getDate();
  const pad=(n:number)=>String(n).padStart(2,'0');
  return `${y}${pad(m)}${pad(d)}`; // VALUE=DATE 용
}
export function detectOverlap(a: RosterEvent, b: RosterEvent) {
  if (a.allDay||b.allDay||!a.start||!a.end||!b.start||!b.end) return false;
  const sa=+new Date(a.start), ea=+new Date(a.end);
  const sb=+new Date(b.start), eb=+new Date(b.end);
  return sa < eb && sb < ea;
}
