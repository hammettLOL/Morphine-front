import { Role } from '../enums/role.enum';
import { Scheduler } from '../enums/scheduler.enum';

// Quien aparece como "Agendado por" al crear una cita, segun el rol del usuario
export function getDefaultSchedulerForRole(role: string | null): Scheduler {
  return role === Role.BookingManager ? Scheduler.Susana : Scheduler.Morphine;
}
