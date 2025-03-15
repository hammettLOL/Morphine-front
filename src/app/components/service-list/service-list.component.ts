import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Service, ServicesService } from '../../services/service.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.css'
})
export class ServicesListComponent implements OnInit {
 services: Service[] = [];
 pageNumber = 1;
 pageSize = 10;
  constructor(
    private readonly serviceService: ServicesService,
    private readonly router: Router,
    private readonly toastService: ToastService,
    private readonly modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.loadServices();
  }
  loadServices() {
    this.serviceService.getServices(this.pageNumber, this.pageSize).subscribe(data => {
      this.services = data;
    });
  }
  nextPage() {
    this.pageNumber++;
    this.loadServices();
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadServices();
    }
  }

  trackByServiceId(index: number, service: Service): number {
    return service.id;
  }

  editService(service: Service) {
    this.router.navigate(['/edit-service', service.id]);
  }
  addService() {
    this.router.navigate(['/add-service']);
  }
 
  deleteService(service: Service){
    this.modalService.confirm({message: `Estas seguro de borrar ${service.type}`, title: 'Confirmar Eliminación'}).subscribe((result)=>{
      if (result) {
        this.serviceService.deleteService(service.id).subscribe({
          next: () => {
            this.toastService.showToast('Servicio eliminado','success');
          // Recarga la lista después de eliminar
            this.loadServices();
          },
          error: (err) => {
            this.toastService.showToast('Error al eliminar el servicio','danger');
          }
        });
      }
  });
}

    
}
