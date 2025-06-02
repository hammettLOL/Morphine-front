import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { PaymentMethod } from '../../../core/enums/payment-method.enum';
import { Status } from '../../../core/enums/status.enum';
import {  Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { Service, ServicesService } from '../../../core/services/service.service';
import { forkJoin, Subject, takeUntil} from 'rxjs';
import { WorkOrderDto } from '../../../core/models/work-order-dto.model';


@Component({
  selector: 'app-edit-work-order',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-work-order.component.html'
})
export class EditWorkOrderComponent implements OnInit, OnDestroy {
  @Input () workOrderId!: number | undefined;
  @Output() workOrderSaved = new EventEmitter<WorkOrderDto>();
  @Output() workOrderCancelled = new EventEmitter<void>();

  workOrderForm!: FormGroup;
  loading = true;
  error: any;
  
  isSumitted = false;
  customerId!: number;
  serviceId!: number;
  services: any[] = []; 
  Status = Status; // Exponer el enum para el template
  PaymentMethod = PaymentMethod; // Exponer el enum
   private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly workOrderService: WorkOrderService,
    private readonly toastService: ToastService,
    private readonly servicesService: ServicesService
  ) {
    this.workOrderForm = this.fb.group({
      customerName: [{value: '', disabled: true}, Validators.required],
      serviceType: [{value: '', disabled: true}, Validators.required],
      schedulerId: ['', Validators.required],
      description: [''],
      status: [Status.Pendiente, Validators.required],
      scheduleDate: ['', Validators.required],
      scheduleTime: ['', Validators.required],
      totalPrice: [0, [Validators.required, Validators.min(0)]],
      advancePrice: [0, [Validators.min(0)]],
      paymentMethod: [PaymentMethod.Efectivo, Validators.required],
      paymentMethodAdvance: [PaymentMethod.Efectivo, Validators.required],
      duration: [2, [Validators.required]],
      percentage: [30]
    });
   }

  ngOnInit(): void {
    this.isSumitted = false;
    this.loadWorkOrder();
    this.onTotalPriceChange();
    this.onPercentageChange();
  }
  onTotalPriceChange() {
    const totalPriceControl = this.workOrderForm.get('totalPrice');
    const percentageControl = this.workOrderForm.get('percentage');
    if (totalPriceControl) {
      totalPriceControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(totalPrice => {
          if (totalPrice) {
            // Calcula el 40% del precio total y actualiza advancePrice
            const advanceValue = parseFloat(totalPrice) * (parseFloat(percentageControl?.value) / 100);
            this.workOrderForm.get('advancePrice')?.setValue(advanceValue.toFixed(0), { emitEvent: false });
          } else {
            this.workOrderForm.get('advancePrice')?.setValue('', { emitEvent: false });
          }
        });
    }
  }

  onPercentageChange() {
    const totalPriceControl = this.workOrderForm.get('totalPrice');
    const percentageControl = this.workOrderForm.get('percentage');
    if (percentageControl) {
      percentageControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(percentage => {
          if (percentage) {
            // Calcula el 40% del precio total y actualiza advancePrice
            const advanceValue = parseFloat(totalPriceControl?.value) * (parseFloat(percentage) / 100);
            this.workOrderForm.get('advancePrice')?.setValue(advanceValue.toFixed(0), { emitEvent: false });
          } else {
            this.workOrderForm.get('advancePrice')?.setValue('', { emitEvent: false });
          }
        });
    }
  }

  loadWorkOrder() {
    if(this.workOrderId) {
      this.loading = true;
      forkJoin({
        services: this.servicesService.getServices(1,10),
        workOrder: this.workOrderService.getById(this.workOrderId)
      }).subscribe({
        next:({ services, workOrder }) => {
          this.setFormValues(services, workOrder);
          this.loading = false;
        },
        error: (err) => {
          this.toastService.showToast('Error al cargar datos', 'danger');
          this.loading = false;
          this.router.navigate(['/work-orders']);
        }
      });
    } else{
      this.loading = false;
    }
  }

  setFormValues(services: Service[], workOrders: WorkOrderDto) {
    this.services = services;
    this.customerId = workOrders.customerId;
    this.serviceId = workOrders.serviceId;
    this.workOrderForm.patchValue({
      customerName: workOrders.customerName,
      serviceType: workOrders.serviceType,
      schedulerId: workOrders.schedulerId,
      status: workOrders.status,
      description: workOrders.description,
      scheduleDate: this.formatDateForInput(workOrders.scheduleDate) || null, // Si es necesario formatear la fecha
      scheduleTime: this.formatTimeForInput(workOrders.scheduleDate) || null, // Si es necesario formatear la fecha
      totalPrice: workOrders.totalPrice,
      advancePrice: workOrders.advancePrice,
      paymentMethod: workOrders.paymentMethod,
      paymentMethodAdvance: workOrders.paymentMethodAdvance,
      duration: workOrders.duration,
      percentage : workOrders.percentage
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formatDateForInput(dateValue: string): string {
    // Si la fecha es el valor por defecto o nula, retorna cadena vacía
    if (!dateValue || dateValue.startsWith("0001-01-01")) {
      return '';
    }
    const date = new Date(dateValue);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatTimeForInput(dateValue: string): string {
  // Si la fecha es el valor por defecto o nula, retorna cadena vacía
  if (!dateValue || dateValue.startsWith("0001-01-01")) {
    return '';
  }
  const date = new Date(dateValue);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

  onSubmit(): void {
     if(this.isSumitted) {
      return;
    }
    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      return;
    }
    if(this.workOrderId) {
      const date = this.workOrderForm.value.scheduleDate;
      const time = this.workOrderForm.value.scheduleTime;
      const combinedDateTime = `${date}T${time}:00`;
      const updatedWorkOrder: WorkOrderDto = {
        ...this.workOrderForm.value,
        paymentMethod : Number(this.workOrderForm.value.paymentMethod),
        paymentMethodAdvance: Number(this.workOrderForm.value.paymentMethodAdvance),
        status: Number(this.workOrderForm.value.status),
        customerId: this.customerId,
        serviceId: this.serviceId,
        duration: Number(this.workOrderForm.value.duration),
        id: this.workOrderId,
        scheduleDate: combinedDateTime
      };
     this.isSumitted = true;;
     this.workOrderSaved.emit(updatedWorkOrder);
     this.isSumitted = false;
    }

  }

  cancel() {
    this.workOrderCancelled.emit();
  }

}
