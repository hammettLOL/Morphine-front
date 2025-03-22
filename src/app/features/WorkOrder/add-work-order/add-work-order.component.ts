import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentMethod, Status, WorkOrderService, WorkOrder } from '../../../core/services/work-order.service';
import { ServicesService } from '../../../core/services/service.service';
import { ToastService } from '../../../core/services/toast.service';
import { CustomersService } from '../../../core/services/customers.service';

@Component({
  selector: 'app-add-work-order',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './add-work-order.component.html',
  styleUrl: './add-work-order.component.css'
})
export class AddWorkOrderComponent implements OnInit {
  workOrderForm!: FormGroup;
  customerId!: number;
  customer: any;
  services: any[] = []; 
  Status = Status; // Exponer el enum para el template
  PaymentMethod = PaymentMethod; // Exponer el enum

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly workOrderService: WorkOrderService,
    private readonly serviceService: ServicesService,
    private readonly customerService: CustomersService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit(): void {
     // Obtener el ID del customer desde la URL
     this.customerId = Number(this.route.snapshot.paramMap.get('customerId'));
     this.workOrderForm = this.fb.group({
       customerId: [this.customerId, Validators.required],
       serviceId: ['', Validators.required],
       description: [''],
       status: [Status.Pendiente, Validators.required],
       scheduleDate: ['', Validators.required],
       totalPrice: [0, [Validators.required, Validators.min(0)]],
       advancePrice: [0],
       paymentMethod: [PaymentMethod.Efectivo, Validators.required]
     });

     // Cargar la lista de servicios para el select
    this.serviceService.getServices(1,10).subscribe({
      next: (data) => {
        this.services = data;
      },
      error: (err) => {
        this.toastService.showToast('Error al cargar servicios','danger');
        this.router.navigate(['/customers']);
      }
    });

    this.customerService.getCustomer(this.customerId).subscribe({
      next: (customer) => {
        this.customer = customer;
      },
      error: (err) => {
        this.toastService.showToast('Error al cargar el cliente','danger');
      }
    });
  }

  onSubmit(): void {
    if (this.workOrderForm.invalid) {
      this.workOrderForm.markAllAsTouched();
      return;
    }
    const createWorkOrder: WorkOrder = {
         ...this.workOrderForm.value,
         paymentMethod : Number(this.workOrderForm.value.paymentMethod),
         status: Number(this.workOrderForm.value.status),
         customerId: Number(this.workOrderForm.value.customerId),
         serviceId: Number(this.workOrderForm.value.serviceId)
       };
    this.workOrderService.create(createWorkOrder).subscribe({
      next: (newOrder: WorkOrder) => {
        // Opcional: mostrar un toast de éxito y redirigir a la lista de órdenes o al detalle del customer
        this.toastService.showToast('Orden de trabajo creada correctamente','success');
        this.router.navigate(['/work-orders']);
      },
      error: (err) => {
        this.toastService.showToast('Error al crear la orden de trabajo','danger');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/customers']);
  }

}
