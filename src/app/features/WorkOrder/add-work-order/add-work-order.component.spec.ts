import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AddWorkOrderComponent } from './add-work-order.component';
import { AuthService } from '../../../core/services/auth.service';
import { ServicesService } from '../../../core/services/service.service';
import { CustomersService } from '../../../core/services/customers.service';
import { ToastService } from '../../../core/services/toast.service';

describe('AddWorkOrderComponent', () => {
  const crear = (role: string) => {
    TestBed.configureTestingModule({
      imports: [AddWorkOrderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { getUserRole: () => role } },
        { provide: ServicesService, useValue: {} },
        { provide: CustomersService, useValue: {} },
        { provide: ToastService, useValue: { showToast: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(AddWorkOrderComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('la booking manager ve Agendado por fijo en Susana, sin selector', () => {
    const fixture = crear('BookingManager');

    expect(fixture.nativeElement.querySelector('select#schedulerId')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="scheduler-fijo"]').textContent.trim()).toBe('Susana');
    expect(fixture.componentInstance.workOrderForm.value.schedulerId).toBe(4);
  });

  it('Admin puede elegir quien agendo', () => {
    const fixture = crear('Admin');

    expect(fixture.nativeElement.querySelector('select#schedulerId')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="scheduler-fijo"]')).toBeNull();
  });
});
