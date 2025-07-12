// src/app/components/add-customer/add-customer.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Customer } from '../../../core/models/customer.model';
import { CommonModule } from '@angular/common';
import { Countries, Country } from '../../../core/models/country';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  customerForm!: FormGroup;
  loading = false;
  error : any;
  @Output() customerCreated = new EventEmitter<Customer>();
  @Output() customerCancelled = new EventEmitter<void>();
  isSubmitted = false;
  countries = Countries;
  selectedCountry: Country = this.countries[0];
  selectedCountryIndex: number = 0;


  constructor(
    private readonly fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      document: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      typeDocument: [0],
      countryCode: [this.selectedCountry.dialCode],
      cellphone: ['',[Validators.minLength(6), Validators.maxLength(15)]],
      birthday: [''],
      instagram: ['']
    });
    this.isSubmitted = false;
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

  onSubmit(): void {
    if(this.isSubmitted) {
      return;
    }

    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    this.isSubmitted = true;

    // Convertir el valor de tipoDocumento a número si la API lo requiere
    const formValues = this.customerForm.value;
    const fullCellphone = formValues.countryCode + formValues.cellphone;
    const newCustomer: Customer = {
      id: 0, // El ID lo asignará la API, generalmente
      name: formValues.name,
      lastName: formValues.lastName,
      email: formValues.email,
      document: formValues.document,
      typeDocument: Number(formValues.typeDocument),
      birthday: formValues.birthday || null,
      cellphone: String(fullCellphone),
      instagram: formValues.instagram
    };

    this.customerCreated.emit(newCustomer);
  }
  onCountryChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const selectedDialCode = target.value;
  
  // Actualizar selectedCountry para mantener la referencia
  this.selectedCountry = this.countries.find(c => c.dialCode === selectedDialCode) || this.countries[0];
}

  resetSubmitState(){
    this.isSubmitted = false;
  }
  cancel() {
    this.customerCancelled.emit();
  }
}
