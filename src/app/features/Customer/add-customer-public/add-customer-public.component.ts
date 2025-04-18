import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Customer, CustomersService } from '../../../core/services/customers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-add-customer-public',
  imports: [CommonModule,ReactiveFormsModule],
  standalone: true,
  templateUrl: './add-customer-public.component.html',
  styleUrl: './add-customer-public.component.css'
})
export class AddCustomerPublicComponent implements OnInit {
  customerForm!: FormGroup;
  token!: string;
  message!: string;
  isValid = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly customersService: CustomersService,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.customersService.validateToken(this.token).subscribe({
      next: (response) => {
        if (response.message === "Token válido") {
          this.isValid = true;
          this.buildForm();
        } else {
          this.isValid = false;
          this.message = 'El enlace no es válido o ha expirado.';
        }
      },
      error: (err) => {
        this.isValid = false;
        this.message = 'El enlace no es válido o ha expirado.';
      }
    });
  }

  buildForm(){
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      document: ['', [Validators.required, Validators.maxLength(14)]],
      typeDocument: [0,Validators.required],
      cellphone: ['',[Validators.required,Validators.minLength(9)]],
      birthday: ['',Validators.required],
      instagram: ['']
    });
  }

    onSubmit(): void {
      if (this.customerForm.invalid) 
        {
          this.customerForm.markAllAsTouched();
          return

        };
  
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
        cellphone: String(formValues.cellphone),
        instagram: formValues.instagram
      };
  
      this.customersService.addCustomerByToken(this.token, newCustomer).subscribe({
        next: (response) => {
          this.isValid = false;
          this.message = 'Gracias por registrarte. Estos datos me ayudaran a contactarte facilmente.';
          this.toastService.showToast('Cliente agregado correctamente.', 'success');
        },
        error: (err) => {
          this.toastService.showToast('Error al agregar el cliente.', 'danger');
        }
      });
    }

    cancel() {
      this.router.navigate(['/']);
    }

}
