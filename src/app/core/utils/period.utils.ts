// Semana de comisiones de la booking manager: lunes a lunes
export interface WeekPeriod {
  start: Date;
  end: Date;
}

export function getCurrentWeekPeriod(): WeekPeriod {
  return getWeekPeriodForDate(new Date());
}

export function getWeekPeriodForDate(date: Date): WeekPeriod {
  const daysSinceMonday = (date.getDay() + 6) % 7; // 0=Lun ... 6=Dom
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysSinceMonday);
  return { start, end: addDays(start, 7) };
}

export function getNextPeriod(current: WeekPeriod): WeekPeriod {
  return getWeekPeriodForDate(addDays(current.start, 7));
}

export function getPreviousPeriod(current: WeekPeriod): WeekPeriod {
  return getWeekPeriodForDate(addDays(current.start, -7));
}

export function formatPeriodLabel(period: WeekPeriod): string {
  return `Lun ${formatDayMonth(period.start)} - Dom ${formatDayMonth(addDays(period.end, -1))}`;
}

export function formatDayMonth(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}`;
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
