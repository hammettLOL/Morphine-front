import { Component, OnInit } from '@angular/core';
import { CustomersService, Customer } from '../../../core/services/customers.service';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { SpeedDialComponent } from '../../../shared/speed-dial/speed-dial.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [CommonModule, SpeedDialComponent,FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomersListComponent implements OnInit {
  customers: Customer[] = [];
  selectedCustomer: Customer | null = null;
  pageNumber = 1;
  pageSize = 15;
  searchTerm = '';

  // Mapeo de valores numéricos a cadenas de texto
  documentTypeMap: { [key: number]: string } = {
    0: 'DNI',
    1: 'CE',
    2: 'Pasaporte'
  };

  constructor(private readonly customersService: CustomersService, 
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customersService.getCustomers(this.pageNumber, this.pageSize, this.searchTerm).subscribe((data) => {
      this.customers = data;
      this.selectedCustomer = null;
    });
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.router.navigate(['/customer/detail/', customer.id]);
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

}
