import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CommissionsComponent } from './commissions.component';
import { BookingManagerDashboardService } from '../../core/services/booking-manager-dashboard.service';
import { MonthlyCommission } from '../../core/models/booking-manager-dashboard.model';
import { AuthService } from '../../core/services/auth.service';

const comision = (overrides: Partial<MonthlyCommission> = {}): MonthlyCommission => ({
  year: 2026, month: 6, meta: 2500, montoAgendado: 5000,
  pagoFijo: 150, comisionExtra: 50, totalComision: 200,
  semanas: [{
    inicio: '2026-06-01T00:00:00', fin: '2026-06-08T00:00:00', totalAgendado: 5000,
    metaAlcanzada: true, pagoFijo: 150, comisionExtra: 50, totalComision: 200
  }],
  citas: [{
    id: 1, creationDate: '2026-06-02T00:00:00', scheduleDate: '2026-09-02T00:00:00',
    customerName: 'Ana Test', totalPrice: 2000, status: 'Pendiente', tipoComision: 'Meta', comision: 150
  }],
  ...overrides
});

describe('CommissionsComponent', () => {
  let getMonthlyCommissions: ReturnType<typeof vi.fn>;

  const crear = (queryParams: Record<string, string> = {}, role = 'BookingManager') => {
    TestBed.configureTestingModule({
      imports: [CommissionsComponent],
      providers: [
        provideRouter([]),
        { provide: BookingManagerDashboardService, useValue: { getMonthlyCommissions } },
        { provide: AuthService, useValue: { getUserRole: () => role } },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(queryParams) } } },
      ],
    });
    const fixture = TestBed.createComponent(CommissionsComponent);
    fixture.detectChanges();
    return fixture;
  };

  const texto = (fixture: ReturnType<typeof crear>, testId: string) =>
    fixture.nativeElement.querySelector(`[data-testid="${testId}"]`)?.textContent.trim();

  beforeEach(() => {
    getMonthlyCommissions = vi.fn().mockReturnValue(of(comision()));
  });

  it('carga el mes indicado en la URL y muestra los totales', () => {
    const fixture = crear({ anio: '2026', mes: '6' });

    expect(getMonthlyCommissions).toHaveBeenCalledWith(2026, 6);
    expect(texto(fixture, 'total-comision')).toBe('S/ 200.00');
    expect(texto(fixture, 'pago-fijo')).toBe('S/ 150.00');
    expect(texto(fixture, 'comision-extra')).toBe('S/ 50.00');
    expect(fixture.nativeElement.textContent).toContain('Junio de 2026');
    expect(fixture.nativeElement.textContent).toContain('Ana Test');
  });

  it('la booking manager ve cuanto le toca cobrar', () => {
    const fixture = crear({ anio: '2026', mes: '6' }, 'BookingManager');

    expect(fixture.nativeElement.textContent).toContain('Total a cobrar');
  });

  it('Admin ve cuanto debe pagar', () => {
    const fixture = crear({ anio: '2026', mes: '6' }, 'Admin');

    expect(fixture.nativeElement.textContent).toContain('Total a pagar');
  });

  it('muestra cada semana de lunes a domingo', () => {
    const fixture = crear({ anio: '2026', mes: '6' });

    expect(fixture.nativeElement.textContent).toContain('Lun 01/06 - Dom 07/06');
  });

  it('sin parametros carga el mes actual', () => {
    const hoy = new Date();
    crear();

    expect(getMonthlyCommissions).toHaveBeenCalledWith(hoy.getFullYear(), hoy.getMonth() + 1);
  });

  it('el boton Mes anterior pasa de enero a diciembre del anio anterior', () => {
    const fixture = crear({ anio: '2026', mes: '1' });

    fixture.nativeElement.querySelector('[aria-label="Mes anterior"]').click();

    expect(getMonthlyCommissions).toHaveBeenLastCalledWith(2025, 12);
  });

  it('el boton Mes siguiente pasa de diciembre a enero', () => {
    const fixture = crear({ anio: '2026', mes: '12' });

    fixture.nativeElement.querySelector('[aria-label="Mes siguiente"]').click();

    expect(getMonthlyCommissions).toHaveBeenLastCalledWith(2027, 1);
  });

  it('muestra mensaje cuando no hay citas en el mes', () => {
    getMonthlyCommissions.mockReturnValue(of(comision({ citas: [], semanas: [], totalComision: 0 })));
    const fixture = crear({ anio: '2026', mes: '6' });

    expect(fixture.nativeElement.textContent).toContain('No hay citas agendadas por Susana en este mes');
  });
});
