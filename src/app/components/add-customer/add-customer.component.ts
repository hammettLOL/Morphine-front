// src/app/components/add-customer/add-customer.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService, Customer } from '../../services/customers.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  customerForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly customersService: CustomersService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      document: ['', [Validators.maxLength(14)]],
      typeDocument: [0],
      cellphone: ['',[Validators.minLength(9)]],
      birthday: [''],
      instagram: ['']
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) return;

    // Convertir el valor de tipoDocumento a número si la API lo requiere
    const formValues = this.customerForm.value;
    const newCustomer: Customer = {
      id: 0, // El ID lo asignará la API, generalmente
      name: formValues.name,
      lastName: formValues.lastName,
      email: formValues.email,
      document: formValues.document,
      typeDocument: formValues.typeDocument,
      birthday: formValues.birthday || null,
      cellphone: formValues.cellphone,
      instagram: formValues.instagram
    };

    this.customersService.addCustomer(newCustomer).subscribe({
      next: (response) => {
        alert('Cliente agregado correctamente.');
        this.router.navigate(['/customers']);
      },
      error: (err) => {
        console.error('Error al agregar el cliente', err);
        alert('Error al agregar el cliente.');
      }
    });
  }
}
