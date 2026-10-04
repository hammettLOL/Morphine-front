import { getDefaultSchedulerForRole } from './scheduler.utils';
import { Scheduler } from '../enums/scheduler.enum';
import { Role } from '../enums/role.enum';

describe('scheduler.utils', () => {
  it('la booking manager agenda por defecto como Susana', () => {
    expect(getDefaultSchedulerForRole(Role.BookingManager)).toBe(Scheduler.Susana);
  });

  it('los demas roles agendan por defecto como Morphine', () => {
    expect(getDefaultSchedulerForRole(Role.Admin)).toBe(Scheduler.Morphine);
    expect(getDefaultSchedulerForRole(Role.AsistenteContable)).toBe(Scheduler.Morphine);
    expect(getDefaultSchedulerForRole(null)).toBe(Scheduler.Morphine);
  });
});
