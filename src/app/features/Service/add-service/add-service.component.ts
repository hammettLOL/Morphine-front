import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service, ServicesService } from '../../../core/services/service.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.css'
})
export class AddServiceComponent implements OnInit {
  serviceForm!: FormGroup;
  constructor(
    private readonly fb: FormBuilder,
    private readonly servicesService: ServicesService,
    private readonly toastService :ToastService,
    private readonly router: Router
  ) {}

    ngOnInit(): void {
      this.serviceForm = this.fb.group({
        type: ['', Validators.required],
        description: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.serviceForm.invalid) return;

    const formValues = this.serviceForm.value;
    const newService: Service = {
      id: 0,
      type: formValues.type,
      description: formValues.description
    };

    this.servicesService.addService(newService).subscribe({
      next: (response) => {
        this.toastService.showToast('Servicio agregado correctamente.', 'success');
        this.router.navigate(['/services']);
      },
      error: (error) => {
        this.toastService.showToast('Error al agregar el servicio.', 'danger');
      }
    });
  }
  cancel() {
    this.router.navigate(['/services']);
  }
}
