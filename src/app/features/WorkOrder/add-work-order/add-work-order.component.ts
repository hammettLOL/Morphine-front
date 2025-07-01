import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from '../../../core/services/service.service';
import { ToastService } from '../../../core/services/toast.service';
import { CustomersService } from '../../../core/services/customers.service';
import { Status } from '../../../core/enums/status.enum';
import { PaymentMethod } from '../../../core/enums/payment-method.enum';
import { WorkOrder } from '../../../core/models/work-order.model';
import { forkJoin, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-work-order',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './add-work-order.component.html',
  styleUrl: './add-work-order.component.css'
})
export class AddWorkOrderComponent implements OnInit, OnDestroy {
  @Input() customerId!: number | undefined;
  @Output() workOrderCreated = new EventEmitter<WorkOrder>();
  @Output() workOrderCancelled = new EventEmitter<void>();
  workOrderForm!: FormGroup;
  customer: any;
  services: any[] = []; 
  Status = Status; // Exponer el enum para el template
  PaymentMethod = PaymentMethod; // Exponer el enum
  loading = false;
  error: any;
  isSumitted = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly serviceService: ServicesService,
    private readonly customerService: CustomersService,
    private readonly toastService: ToastService
  ) {

   }

   initForm(){
    this.workOrderForm = this.fb.group({
      customerId: [this.customerId, Validators.required],
      serviceId: ['', Validators.required],
      schedulerId: [1, Validators.required],
      description: [''],
      status: [Status.Pendiente, Validators.required],
      creationDate: ['', Validators.required],
      scheduleDate: ['', Validators.required],
      scheduleTime: ['', Validators.required],
      percentage: [30],
      totalPrice: [0, [Validators.required, Validators.min(0)]],
      advancePrice: [0],
      duration: [2, Validators.required],
      paymentMethod: [PaymentMethod.Efectivo, Validators.required],
      paymentMethodAdvance: [PaymentMethod.Efectivo, Validators.required]
    });
   }

  ngOnInit(): void {
    this.initForm();
    if(this.customerId) {
      this.workOrderForm.get('customerId')?.setValue(this.customerId);
      this.loadCustomerAndServices();
    }
   this.isSumitted = false;
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
            this.workOrderForm.get('advancePrice')?.setValue('0', { emitEvent: false });
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
            this.workOrderForm.get('advancePrice')?.setValue('0', { emitEvent: false });
          }
        });
    }
  }

  

  loadCustomerAndServices() {
    if(this.customerId) {
      this.loading = true;
      forkJoin({
        customer: this.customerService.getCustomer(this.customerId),
        services: this.serviceService.getServices(1,10)
      }).subscribe({
        next:({ customer, services }) => {
          this.services = services;
          this.customer = customer;
          this.loading = false;
        },
        error: (err) => {
          this.toastService.showToast('Error al cargar datos', 'danger');
          this.loading = false;
          this.router.navigate(['/customers']);
        }
      });
    }
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if(this.isSumitted) {
      return;
    }
   

    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      return;
    }
    this.isSumitted = true;
    if(this.customerId) {
      // Combinar fecha y hora
      const date = this.workOrderForm.value.scheduleDate;
      const time = this.workOrderForm.value.scheduleTime;
      const combinedDateTime = `${date}T${time}:00`;
      const createWorkOrder: WorkOrder = {
        ...this.workOrderForm.value,
        paymentMethod : Number(this.workOrderForm.value.paymentMethod),
        paymentMethodAdvance : Number(this.workOrderForm.value.paymentMethodAdvance),
        status: Number(this.workOrderForm.value.status),
        schedulerId: Number(this.workOrderForm.value.schedulerId),
        customerId: Number(this.workOrderForm.value.customerId),
        serviceId: Number(this.workOrderForm.value.serviceId),
        duration: Number(this.workOrderForm.value.duration),
        creationDate: this.workOrderForm.value.creationDate,
        scheduleDate: combinedDateTime
      };
      this.workOrderCreated.emit(createWorkOrder);
    }
  }
  resetSubmitState(){
    this.isSumitted = false;
  }
  cancel(): void {
    this.workOrderCancelled.emit();
  }

}
