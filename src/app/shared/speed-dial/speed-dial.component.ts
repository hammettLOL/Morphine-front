import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SpeedDialModalComponent } from '../speed-dial-modal/speed-dial-modal.component';
import { Router } from '@angular/router';
import { CustomersService } from '../../core/services/customers.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-speed-dial',
  standalone: true,
  imports: [CommonModule, SpeedDialModalComponent],
  templateUrl: './speed-dial.component.html'
})
export class SpeedDialComponent {
open = false;
modalOpen = false;

constructor(
  private router: Router, 
  private customerService: CustomersService,
  private toast: ToastService) {}

openModal() {
  this.modalOpen = true;
}

closeModal() {
  this.modalOpen = false;
}

handleGenerateLink() {
  // Aquí llamas tu lógica para generar el link
  this.modalOpen = false;
  this.customerService.generateRegistrationLink().subscribe({
    next: ({ link }) => {
      // Copia el link al portapapeles
      navigator.clipboard.writeText(link);
      this.toast.showToast('Link copiado al portapapeles', 'success',5000);
    },
    error: (error) => {
      this.toast.showToast('Error al generar el link', 'danger',5000);
    }
  });
}

handleAddCustomer() {
  // Navegas a la ruta agregar cliente
  this.modalOpen = false;
  this.router.navigate(['/add-customer']);
}

}
