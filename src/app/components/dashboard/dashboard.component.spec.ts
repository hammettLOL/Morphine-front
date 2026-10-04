import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { DashboardMetrics, DashboardService } from '../../core/services/dashboard.service';

describe('DashboardComponent', () => {
  const metricasBase: DashboardMetrics = {
    totalGeneralIncome: 0, limaEspacioIncome: 0, morphineScheduledForLimaEspacio: 0,
    totalEmittedSunat: 0, morphineOwnIncome: 0, totalCompletedAppointments: 0,
    morphineScheduledAppointments: 0, limaEspacioAppointments: 0, totalEmittedInvoices: 0,
    canceledAppointments: 0, canceledAdvanceRefund: 0, year: 2026, month: 4,
  };

  const cargar = (metricas: Partial<DashboardMetrics>) => {
    TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: DashboardService, useValue: { getMetricsByPeriod: vi.fn().mockReturnValue(of({ ...metricasBase, ...metricas })) } },
      ],
    });
    const fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
    fixture.componentInstance.loadMetrics();
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  const texto = (el: HTMLElement, testId: string) =>
    el.querySelector(`[data-testid="${testId}"]`)?.textContent?.replace(/\s+/g, ' ').trim();

  it('muestra los adelantos devueltos y la cantidad de citas canceladas', () => {
    const el = cargar({ canceledAppointments: 2, canceledAdvanceRefund: 750 });

    expect(texto(el, 'adelantos-devueltos')).toContain('750.00');
    expect(texto(el, 'citas-canceladas')).toBe('2');
  });

  it('no repite el monto de Morphine en el desglose', () => {
    const el = cargar({ morphineOwnIncome: 1234 });

    const filas = Array.from(el.querySelectorAll('[data-testid="desglose"] span.text-lg'))
      .filter(s => s.textContent?.includes('1,234.00'));
    expect(filas.length).toBe(1);
  });

  it('sin ingresos en el mes los porcentajes del resumen muestran 0%', () => {
    const el = cargar({});

    expect(texto(el, 'porcentaje-morphine')).toBe('0%');
    expect(texto(el, 'porcentaje-lima-espacio')).toBe('0%');
    expect(texto(el, 'promedio-por-cita')).toContain('0');
  });
});
