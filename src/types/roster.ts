export type TzId = 'Australia/Brisbane';

export interface RosterEvent {
  id: string;
  title: string;
  role?: string;
  location?: string;
  notes?: string;
  start?: string;      // ISO with +10:00
  end?: string;        // ISO with +10:00
  allDay?: boolean;    // RDO/휴무
  tzid: TzId;
  raw?: string;
}

export interface ParseWarning {
  id: string;
  message: string;
  eventId?: string;
  severity: 'info' | 'warn' | 'error';
}

export interface ParsedRoster {
  events: RosterEvent[];
  warnings: ParseWarning[];
  month?: number; // 1-12
  year?: number;
}
