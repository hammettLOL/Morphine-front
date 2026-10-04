import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EditWorkOrderComponent } from './edit-work-order.component';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { ServicesService } from '../../../core/services/service.service';
import { ToastService } from '../../../core/services/toast.service';
import { Status } from '../../../core/enums/status.enum';

describe('EditWorkOrderComponent', () => {
  const crear = () => {
    TestBed.configureTestingModule({
      imports: [EditWorkOrderComponent],
      providers: [
        provideRouter([]),
        { provide: WorkOrderService, useValue: {} },
        { provide: ServicesService, useValue: {} },
        { provide: ToastService, useValue: { showToast: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(EditWorkOrderComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('permite marcar la cita como cancelada', () => {
    const fixture = crear();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select#status');

    expect(select).not.toBeNull();
    const cancelado = Array.from(select.options).find(o => o.textContent?.trim() === 'Cancelado')!;
    select.value = cancelado.value;
    select.dispatchEvent(new Event('change'));

    expect(Number(fixture.componentInstance.workOrderForm.value.status)).toBe(Status.Cancelado);
  });
});
