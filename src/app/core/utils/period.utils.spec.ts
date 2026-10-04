import { formatPeriodLabel, getNextPeriod, getWeekPeriodForDate } from './period.utils';

describe('period.utils', () => {
  it('la semana empieza el lunes y termina el lunes siguiente', () => {
    const periodo = getWeekPeriodForDate(new Date(2026, 5, 3, 15)); // miercoles 03/06/2026

    expect(periodo.start).toEqual(new Date(2026, 5, 1));
    expect(periodo.end).toEqual(new Date(2026, 5, 8));
  });

  it('un domingo pertenece a la semana del lunes anterior', () => {
    const periodo = getWeekPeriodForDate(new Date(2026, 5, 7, 20));

    expect(periodo.start).toEqual(new Date(2026, 5, 1));
  });

  it('avanza de lunes a lunes', () => {
    const siguiente = getNextPeriod(getWeekPeriodForDate(new Date(2026, 5, 1)));

    expect(siguiente.start).toEqual(new Date(2026, 5, 8));
  });

  it('muestra la etiqueta de lunes a domingo', () => {
    const etiqueta = formatPeriodLabel(getWeekPeriodForDate(new Date(2026, 5, 1)));

    expect(etiqueta).toBe('Lun 01/06 - Dom 07/06');
  });
});
