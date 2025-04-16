import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SpeedDialModalComponent } from '../speed-dial-modal/speed-dial-modal.component';
import { Router } from '@angular/router';
import { CustomersService } from '../../core/services/customers.service';

@Component({
  selector: 'app-speed-dial',
  standalone: true,
  imports: [CommonModule, SpeedDialModalComponent],
  templateUrl: './speed-dial.component.html'
})
export class SpeedDialComponent {
open = false;
modalOpen = false;

constructor(private router: Router, private customerService: CustomersService) {}

openModal() {
  this.modalOpen = true;
}

closeModal() {
  this.modalOpen = false;
}

handleGenerateLink() {
  // Aquí llamas tu lógica para generar el link
  this.modalOpen = false;
  console.log('Generar link...');
}

handleAddCustomer() {
  // Navegas a la ruta agregar cliente
  this.modalOpen = false;
  this.router.navigate(['/add-customer']);
}

}
