import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicesService, Service } from '../../../core/services/service.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-edit-service',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.css'
})
export class EditServiceComponent implements OnInit {
  serviceForm!: FormGroup;
  serviceId!: number;
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly servicesService: ServicesService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.serviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.serviceForm = this.fb.group({
      type: ['', Validators.required],
      description: ['', Validators.required]
    }); 

    this.servicesService.getService(this.serviceId).subscribe({
      next: (service: Service) => {
        this.serviceForm.patchValue({
          type: service.type,
          description: service.description
        });
      },
      error: (err) => {
        this.toastService.showToast('Error al cargar el servicio.', 'danger');
      }
    });
  }
  
  onSubmit(): void {
    if (this.serviceForm.invalid) return;

    const formValues = this.serviceForm.value;
    const updatedService: Service = {
      id: this.serviceId,
      type: formValues.type,
      description: formValues.description
    };

    this.servicesService.updateService(updatedService).subscribe({
      next: () => {
        this.toastService.showToast('Servicio actualizado correctamente.', 'success');
        this.router.navigate(['/services']);
      },
      error: (error) => {
        this.toastService.showToast('Error al actualizar el servicio.', 'danger');
      }
    });
  }
  cancel() {
    this.router.navigate(['/services']);
  }
}
