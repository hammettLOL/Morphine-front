import { Component, OnInit } from '@angular/core';
import { CustomersService, Customer } from '../../services/customers.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  pageNumber = 1;
  pageSize = 10;

  // Mapeo de valores numéricos a cadenas de texto
  documentTypeMap: { [key: number]: string } = {
    0: 'DNI',
    1: 'CE',
    2: 'Pasaporte'
  };

  constructor(private readonly customersService: CustomersService, 
    private readonly router: Router,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customersService.getCustomers(this.pageNumber, this.pageSize).subscribe(data => {
      console.log("llamando carga de clientes");
      this.customers = data;
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

  editCustomer(customer: Customer) {
    // Navegar a la pantalla de edición pasando el ID del cliente
    this.router.navigate(['/edit-customer', customer.id]);
  }
  addCustomer() {
    this.router.navigate(['/add-customer']);
  }

  deleteCustomer(customer: Customer) {
    // Aquí llamas al servicio para eliminar el cliente, por ejemplo:
    if (confirm(`¿Estás seguro de eliminar a ${customer.name}?`)) {
      this.customersService.deleteCustomer(customer.id).subscribe({
        next: () => {
          this.toastService.showToast('Cliente eliminado','success');
          // Recarga la lista después de eliminar
          this.loadCustomers();
        },
        error: (err) => {
          this.toastService.showToast('Error al eliminar cliente','danger');
        }
      });
    }
  }
}
