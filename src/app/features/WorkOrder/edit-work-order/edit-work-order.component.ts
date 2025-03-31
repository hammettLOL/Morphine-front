import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentMethod, Status, WorkOrderService } from '../../../core/services/work-order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ServicesService } from '../../../core/services/service.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-work-order',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './edit-work-order.component.html',
  styleUrl: './edit-work-order.component.css'
})
export class EditWorkOrderComponent implements OnInit {
  workOrderForm!: FormGroup;
  workOrderId!: number;
  customerId!: number;
  services: any[] = []; 
  Status = Status; // Exponer el enum para el template
  PaymentMethod = PaymentMethod; // Exponer el enum
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly workOrderService: WorkOrderService,
    private readonly toastService: ToastService,
    private readonly servicesService: ServicesService
  ) { }

  ngOnInit(): void {
    this.workOrderId = Number(this.route.snapshot.paramMap.get('id'));
    this.workOrderForm = this.fb.group({
      customerName: [{value: '', disabled: true}, Validators.required],
      serviceId: ['', Validators.required],
      description: [''],
      status: [Status.Pendiente, Validators.required],
      scheduleDate: ['', Validators.required],
      totalPrice: [0, [Validators.required, Validators.min(0)]],
      advancePrice: [0],
      paymentMethod: [PaymentMethod.Efectivo, Validators.required]
    });


    forkJoin({
      services: this.servicesService.getServices(1,10),
      workOrder: this.workOrderService.getById(this.workOrderId)
    }).subscribe({
      next:({ services, workOrder }) => {
        this.services = services;
        this.customerId = workOrder.customerId;
        this.workOrderForm.patchValue({
          customerName: workOrder.customerName,
          serviceId: workOrder.serviceId,
          status: workOrder.status,
          scheduleDate: this.formatDateForInput(workOrder.scheduleDate) || null, // Si es necesario formatear la fecha
          totalPrice: workOrder.totalPrice,
          advancePrice: workOrder.advancePrice,
          paymentMethod: workOrder.paymentMethod
        });
      },
      error: (err) => {
        this.toastService.showToast('Error al cargar datos', 'danger');
        this.router.navigate(['/work-orders']);
      }
    });
    
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

  onSubmit(): void {
    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      return;
    }
    const updatedWorkOrder: any = {
      ...this.workOrderForm.value,
      paymentMethod : Number(this.workOrderForm.value.paymentMethod),
      status: Number(this.workOrderForm.value.status),
      serviceId: Number(this.workOrderForm.value.serviceId),
      customerId: this.customerId,
      id: this.workOrderId
    };
    this.workOrderService.update(this.workOrderId, updatedWorkOrder).subscribe({
      next: () => {
        this.toastService.showToast('Orden de trabajo actualizada correctamente','success');
        this.router.navigate(['/work-orders']);
      },
      error: (err) => {
        this.toastService.showToast('Error al actualizar la orden de trabajo','danger');
      }
    });
  }

  cancel() {
    this.router.navigate(['/work-orders']);
  }

}
