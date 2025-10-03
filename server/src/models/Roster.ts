export interface Shift {
  id: string;
  userId: string;
  start: Date;
  end: Date;
}

export interface Roster {
  id: string;
  name: string;
  shifts: Shift[];
}
