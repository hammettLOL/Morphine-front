// src/app/components/edit-customer/edit-customer.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CustomersService} from '../../../core/services/customers.service';
import { Customer } from '../../../core/models/customer.model';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-edit-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-customer.component.html'
})
export class EditCustomerComponent implements OnInit {
  @Input() customerId!: number | undefined; 
  @Output() customerSaved = new EventEmitter<Customer>();
  @Output() customerCancelled = new EventEmitter<void>();

  customerForm!: FormGroup;
  loading = true;
  error?: any;
  isSubmitted = false;

  constructor(
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly customersService: CustomersService,
    private readonly toastService: ToastService
  ) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      document: ['', [Validators.pattern(/^[0-9]{8}$/)]],
      typeDocument: [0],
      cellphone: ['',[Validators.minLength(9),Validators.maxLength(12)]],
      birthday: [''],
      instagram: ['']
    });

  }
  applyDocumentValidators(type: number) {
      
      const documentFormControl = this.customerForm.get('document')!;
      const validators = [ Validators.required ];
      switch (type) {
        case 0: // DNI Peruano: exactamente 8 dígitos numéricos
          validators.push(Validators.pattern(/^[0-9]{8}$/));
          break;
  
        case 1: // CE: Carné de extranjería, 9 caracteres alfanuméricos
          validators.push(Validators.pattern(/^[A-Za-z0-9]{9}$/));
          break;
  
        case 2: // Pasaporte: entre 6 y 9 caracteres alfanuméricos
          validators.push(Validators.pattern(/^[A-Za-z0-9]{6,11}$/));
          break;
      }
  
      documentFormControl.setValidators(validators);
  
      const currentValue = documentFormControl.value;
      documentFormControl.setValue(currentValue);
      
    }
  
    get documentFormControl(): AbstractControl {
      return this.customerForm.get('document')!;
    }

  ngOnInit(): void {
    this.isSubmitted = false;
    this.loadCustomer();
  }

  loadCustomer() {
    if(this.customerId) {
      this.loading = true;
        this.customersService.getCustomer(this.customerId).subscribe({
        next:(customer : Customer) => {
          this.setFormValues(customer);
          this.loading = false;
        },
        error: (err) => {
          this.toastService.showToast('Error al cargar datos', 'danger');
          this.loading = false;
          this.router.navigate(['/customers']);
        }
      });
    } else{
      this.loading = false;
    }
  }
  setFormValues(customer: Customer) {
    this.customerForm.patchValue({
      name: customer.name,
      lastName: customer.lastName,
      email: customer.email,
      document: customer.document,
      typeDocument: customer.typeDocument,
      birthday: this.formatDateForInput(customer.birthday) || null, // Si es necesario formatear la fecha
      cellphone: customer.cellphone,
      instagram: customer.instagram
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
    if(this.isSubmitted) {
      return;
    }
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    this.isSubmitted = true;
    const updatedCustomer: Customer = {
      ...this.customerForm.value,
      cellphone : String(this.customerForm.value.cellphone),
      typeDocument: Number(this.customerForm.value.typeDocument), 
      id: this.customerId
    };

    this.customerSaved.emit(updatedCustomer);
  }

  resetSubmitState(){
    this.isSubmitted = false;
  }

  cancel() {
    this.customerCancelled.emit();
  }
}
