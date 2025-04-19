import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../../../core/services/customers.service';
import { Customer } from '../../../core/models/customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-customer-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css'
})
export class CustomerDetailComponent implements OnInit {
  customer?: Customer;
  loading: boolean = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly customerService: CustomersService,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.customerService.getCustomer(id).subscribe({
      next: (data: Customer) => {
        this.customer = data;
        this.loading = false;
      },
      error: (err) => {
        this.toastService.showToast('Error al cargar cliente', 'danger');
        this.loading = false;
        this.router.navigate(['/customers']);
      }
    });
  }

   // Mapeo de valores numéricos a cadenas de texto
   documentTypeMap: { [key: number]: string } = {
    0: 'DNI',
    1: 'CE',
    2: 'Pasaporte'
  };
  addWorkOrder(): void {
    if (this.customer) {
      // Redirige a la ruta de agregar orden de trabajo con el ID del cliente seleccionado
      this.router.navigate(['/add-work-order/', this.customer.id]);
    }
  }

  editCustomer(): void {
    if (this.customer) {
      this.router.navigate(['/edit-customer', this.customer.id]);
    }
  }
  addCustomer() {
    this.router.navigate(['/add-customer']);
  }

  deleteCustomer() {
    if (this.customer) {
      const customerId = this.customer.id;
      const customerName = this.customer.name;
        this.modalService.confirm({message: `Estas seguro de borrar a ${customerName}`, title: 'Confirmar Eliminación'}).subscribe((result)=>{
          if (result) {
            this.customerService.deleteCustomer(customerId).subscribe({
              next: () => {
                this.toastService.showToast('Cliente eliminado','success');
                this.router.navigate(['/customers'])
              },
              error: (err) => {
                this.toastService.showToast('Error al eliminar cliente','danger');
              }
            });
          }
        });
      }else{
        this.toastService.showToast('No hay un cliente válido para eliminar','warning');
      }
  }
}
