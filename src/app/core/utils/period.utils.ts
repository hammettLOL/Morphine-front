export interface FridayPeriod {
  start: Date;
  end: Date;
}

export function getCurrentFridayPeriod(): FridayPeriod {
  return getFridayPeriodForDate(new Date());
}

export function getFridayPeriodForDate(date: Date): FridayPeriod {
  const d = new Date(date);
  const day = d.getDay(); // 0=Dom, 5=Vie
  const diffToFriday = (day >= 5) ? day - 5 : day + 2;
  const start = new Date(d);
  start.setDate(d.getDate() - diffToFriday);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return { start, end };
}

export function getNextPeriod(current: FridayPeriod): FridayPeriod {
  const nextStart = new Date(current.start);
  nextStart.setDate(nextStart.getDate() + 7);
  const nextEnd = new Date(nextStart);
  nextEnd.setDate(nextStart.getDate() + 7);
  return { start: nextStart, end: nextEnd };
}

export function getPreviousPeriod(current: FridayPeriod): FridayPeriod {
  const prevStart = new Date(current.start);
  prevStart.setDate(prevStart.getDate() - 7);
  const prevEnd = new Date(prevStart);
  prevEnd.setDate(prevStart.getDate() + 7);
  return { start: prevStart, end: prevEnd };
}

export function formatPeriodLabel(period: FridayPeriod): string {
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit' };
  const startStr = period.start.toLocaleDateString('es-PE', opts);
  const endDate = new Date(period.end);
  endDate.setDate(endDate.getDate() - 1);
  const endStr = endDate.toLocaleDateString('es-PE', opts);
  return `Vie ${startStr} - Jue ${endStr}`;
}

export function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}
