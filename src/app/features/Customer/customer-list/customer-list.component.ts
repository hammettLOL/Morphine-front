import { Component, OnInit } from '@angular/core';
import { CustomersService} from '../../../core/services/customers.service';
import { Customer } from '../../../core/models/customer.model';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { SpeedDialComponent } from '../../../shared/speed-dial/speed-dial.component';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../core/services/modal.service';
import { EditCustomerComponent } from '../edit-customer/edit-customer.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, SpeedDialComponent,FormsModule, EditCustomerComponent],
  templateUrl: './customer-list.component.html',
  animations: [
        trigger('modalAnimation', [
          transition(':enter', [
            style({ opacity: 0 }),
            animate('150ms ease-out', style({ opacity: 1 }))
          ]),
          transition(':leave', [
            animate('120ms ease-in', style({ opacity: 0 }))
          ])
        ]),
        trigger('contentAnimation', [
          transition(':enter', [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            animate('200ms 50ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ]),
          transition(':leave', [
            animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
          ])
        ])
      ]
})
export class CustomersListComponent implements OnInit {
  customers?: Customer[] = undefined;
  isModalOpen = false;
  selectedCustomerId: number | undefined;
  selectedCustomer: Customer | null = null;
  pageNumber = 1;
  totalPages = 1;
  pageSize = 10;
  hasPreviousPage = false;
  hasNextPage = false;
  searchTerm = '';

  // Mapeo de valores numéricos a cadenas de texto
  documentTypeMap: { [key: number]: string } = {
    0: 'DNI',
    1: 'CE',
    2: 'Pasaporte'
  };

  constructor(private readonly customersService: CustomersService, 
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customersService.getCustomers(this.pageNumber, this.pageSize, this.searchTerm).subscribe((data) => {
      this.customers = data.items;
      this.hasPreviousPage = this.pageNumber > 1;
      this.hasNextPage = data.totalPages > this.pageNumber;
      this.totalPages = data.totalPages;
      this.selectedCustomer = null;
    });
  }

  nextPage() {
    this.pageNumber++;
    this.loadCustomers();
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadCustomers();
    }
  }

  trackByCustomerId(index: number, customer: Customer): number {
    return customer.id;
  }

  onSearchTermChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.pageNumber = 1;
    this.loadCustomers();
  }

  addWorkOrder(customer: Customer): void {
    if (customer) {
      // Redirige a la ruta de agregar orden de trabajo con el ID del cliente seleccionado
      this.router.navigate(['/add-work-order/', customer.id]);
    }
  }

  editCustomer(customer: Customer): void {
    if (customer) {
      this.selectedCustomerId = customer.id;
      this.isModalOpen = true;
    }
  }
  deleteCustomer(customer: Customer) {
    if (customer) {
      const customerId = customer.id;
      const customerName = customer.name;
        this.modalService.confirm({message: `Estas seguro de borrar a ${customerName}`, title: 'Confirmar Eliminación'}).subscribe((result)=>{
          if (result) {
            this.customersService.deleteCustomer(customerId).subscribe({
              next: () => {
                this.toastService.showToast('Cliente eliminado','success');
                this.loadCustomers();
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

  closeEditModal() {
    this.isModalOpen = false;
    this.selectedCustomerId = undefined;
  }
  onCustomerSaved(customer: any) {
    this.customersService.updateCustomer(customer).subscribe({
      next: () => {
        this.toastService.showToast('Cliente actualizado correctamente','success');
        this.closeEditModal();
        this.loadCustomers();
      },
      error: (err) => {
        this.toastService.showToast('Error al actualizar el cliente','danger');
      }
    });
  }
  onCustomerCanceled() {
    this.closeEditModal();
    this.loadCustomers();
  }

}
