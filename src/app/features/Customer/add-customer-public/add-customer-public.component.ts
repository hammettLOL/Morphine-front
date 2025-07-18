import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomersService } from '../../../core/services/customers.service';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { Customer } from '../../../core/models/customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { WorkOrder } from '../../../core/models/work-order.model';
import { Scheduler } from '../../../core/enums/scheduler.enum';
import { Status } from '../../../core/enums/status.enum';
import { CustomerByDocument } from '../../../core/models/customer-by-document.model';
import { Countries, Country } from '../../../core/models/country';

@Component({
  selector: 'app-add-customer-public',
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  standalone: true,
  templateUrl: './add-customer-public.component.html',
  styleUrl: './add-customer-public.component.css',
})
export class AddCustomerPublicComponent implements OnInit {
  customerForm!: FormGroup;
  verificationForm!: FormGroup;
  token!: string;
  message!: string;
  isValid = false;
  customerVerified = false;
  existingCustomer: CustomerByDocument | null = null;
  isVerifyDocumentSubmitted = false;
  isSubmitted = false;
  countries = Countries;
  selectedCountry: Country = this.countries[0];
  selectedCountryIndex: number = 0;
  filteredCountries: Country[] = [];
  showCountryDropdown = false;
  countrySearchTerm = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly customersService: CustomersService,
    private readonly workOrdersService: WorkOrderService,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.customersService.validateToken(this.token).subscribe({
      next: (response) => {
        if (response.message === 'Token válido') {
          this.isValid = true;
          this.buildVerificationForm();
        } else {
          this.isValid = false;
          this.message = 'El enlace no es válido o ha expirado.';
        }
      },
      error: (err) => {
        this.isValid = false;
        this.message = 'El enlace no es válido o ha expirado.';
      },
    });
    this.isVerifyDocumentSubmitted = false;
    this.isSubmitted = false;
  }

  buildForm(document: string, typeDocument: string) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      document: [
        document,
        [Validators.required, Validators.pattern(/^[0-9]{8}$/)],
      ],
      typeDocument: [Number(typeDocument), Validators.required],
      countryCode: [this.selectedCountry.dialCode],
      cellphone: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ],
      ],
      birthday: ['', Validators.required],
      instagram: [''],
      reference: ['', Validators.required], // Solo se requiere la referencia
    });
    this.applyDocumentValidators(Number(typeDocument));
    this.filteredCountries = [...this.countries];
  }

  applyDocumentValidators(type: number) {
    const documentFormControl = this.customerForm.get('document')!;
    const validators = [Validators.required];
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
    if (this.isSubmitted) {
      return;
    }

    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }
    this.isSubmitted = true;

    // Obtener valores del formulario
    const formValues = this.customerForm.value;
    const reference = formValues.reference; // Guardar la referencia para la orden de trabajo
    const fullCellphone = formValues.countryCode + formValues.cellphone;

    if (this.existingCustomer) {
      // Si es un cliente existente, solo se crea una orden de trabajo
      this.createWorkOrder(this.existingCustomer.id, reference);
    } else {
      // Si es un cliente nuevo, se crea el cliente y luego una orden de trabajo
      const newCustomer: Customer = {
        id: 0, // El ID lo asignará la API
        name: formValues.name,
        lastName: formValues.lastName,
        email: formValues.email,
        document: formValues.document,
        typeDocument: formValues.typeDocument,
        birthday: formValues.birthday || null,
        cellphone: String(fullCellphone),
        instagram: formValues.instagram,
      };

      this.customersService
        .addCustomerByToken(this.token, newCustomer)
        .subscribe({
          next: (customer) => {
            this.toastService.showToast(
              'Cliente agregado correctamente.',
              'success'
            );
            // Crear orden de trabajo después de agregar el cliente
            this.createWorkOrder(customer.id, reference);
          },
          error: (err) => {
            this.isSubmitted = false;
            this.toastService.showToast(
              'Error al agregar el cliente.',
              'danger'
            );
          },
        });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

   // Método para filtrar países
  filterCountries(searchTerm: string): void {
    this.countrySearchTerm = searchTerm;
    
    if (!searchTerm.trim()) {
      this.filteredCountries = [...this.countries];
      return;
    }
  
    this.filteredCountries = this.countries.filter(country => 
      // Filtrar por código de país
      country.dialCode.includes(searchTerm) ||
      // Filtrar por nombre del país
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // Filtrar por código ISO
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Seleccionar país del dropdown
  selectCountry(country: Country): void {
    this.selectedCountry = country;
    this.customerForm.patchValue({ countryCode: country.dialCode });
    this.showCountryDropdown = false;
    this.countrySearchTerm = `${country.flag} +${country.dialCode}`;
    this.filteredCountries = [...this.countries];
  }
  
  // Mostrar/ocultar dropdown
  toggleCountryDropdown(): void {
    this.showCountryDropdown = !this.showCountryDropdown;
    if (this.showCountryDropdown) {
      this.countrySearchTerm = '';
      this.filteredCountries = [...this.countries];
    }
  }
  
  // Cerrar dropdown al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.country-selector')) {
      this.showCountryDropdown = false;
    }
  }

  onCountryChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const selectedDialCode = target.value;

  
  
  // Actualizar selectedCountry para mantener la referencia
  this.selectedCountry = this.countries.find(c => c.dialCode === selectedDialCode) || this.countries[0];
}

  // Nuevo método para construir el formulario de verificación
  buildVerificationForm() {
    this.verificationForm = this.fb.group({
      document: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      typeDocument: [0, Validators.required],
    });
  }

  // Método para aplicar validadores al formulario de verificación
  applyDocumentValidatorsForVerification(type: number) {
    const documentFormControl = this.verificationForm.get('document')!;
    const validators = [Validators.required];
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
    documentFormControl.updateValueAndValidity();
  }

  // Método para verificar un documento
  verifyDocument(): void {
    if (this.isVerifyDocumentSubmitted) {
      return;
    }

    if (this.verificationForm.invalid) {
      this.verificationForm.markAllAsTouched();
      return;
    }

    this.isVerifyDocumentSubmitted = true;

    const typeDocument = this.verificationForm.get('typeDocument')?.value;
    const document = this.verificationForm.get('document')?.value;

    this.customersService
      .findCustomerByDocumentNumber(this.token, typeDocument, document)
      .subscribe({
        next: (customer) => {
          this.customerVerified = true;

          if (customer) {
            // Cliente existente
            this.existingCustomer = customer;
            this.buildFormForExistingCustomer();
          } else {
            // Nuevo cliente
            this.existingCustomer = null;
            this.buildForm(document, typeDocument);
          }
        },
        error: (err) => {
          this.isVerifyDocumentSubmitted = false;
          this.toastService.showToast(
            'Error al verificar el documento.',
            'danger'
          );
        },
      });
  }
  // Método para construir formulario para cliente existente
  buildFormForExistingCustomer() {
    this.customerForm = this.fb.group({
      reference: ['', Validators.required], // Solo se requiere la referencia
    });
  }

  // Método para crear una orden de trabajo
  createWorkOrder(customerId: number, description: string): void {
    const workOrder: WorkOrder = {
      id: 0, // El ID lo asignará la API
      customerId: customerId,
      schedulerId: Scheduler.Morphine,
      serviceId: 1,
      description: description,
      status: Status.Pendiente,
      // Agregar otros campos que pueda requerir tu modelo WorkOrder
    };

    this.workOrdersService
      .addWorkOrderByToken(this.token, workOrder)
      .subscribe({
        next: (response) => {
          this.isValid = false;
          this.message =
            'Gracias por registrarte. Nos comunicaremos contigo próximamente.';
        },
        error: (err) => {
          this.message =
            'Error al crear la solicitud de tatuaje. Comuniquese con Morphine.';
        },
      });
  }
}
