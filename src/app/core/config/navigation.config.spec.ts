import { MENU_ITEMS, getDefaultRouteForRole } from './navigation.config';
import { Role } from '../enums/role.enum';

describe('navigation.config', () => {
  const comisiones = () => MENU_ITEMS.find(item => item.route === '/comisiones');

  it('Comisiones es visible para Admin y BookingManager', () => {
    expect(comisiones()?.roles).toEqual([Role.Admin, Role.BookingManager]);
  });

  it('AsistenteContable no ve Comisiones', () => {
    expect(comisiones()?.roles).not.toContain(Role.AsistenteContable);
  });

  it('la pagina inicial de cada rol no cambia', () => {
    expect(getDefaultRouteForRole(Role.Admin)).toBe('/dashboard');
    expect(getDefaultRouteForRole(Role.BookingManager)).toBe('/dashboard-bm');
    expect(getDefaultRouteForRole(Role.AsistenteContable)).toBe('/customers');
  });
});
