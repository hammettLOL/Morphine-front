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
  this.customerService.generateRegistrationLink().subscribe({
    next: ({ link }) => {
      // Copia el link al portapapeles
      this.copyToClipboard(link);
      this.toast.showToast('Link copiado al portapapeles', 'success',5000);
      
    },
    error: (error) => {
      this.toast.showToast('Error al generar el link', 'danger',5000);
    }
  });

  this.modalOpen = false;
}

handleAddCustomer() {
  // Navegas a la ruta agregar cliente
  this.modalOpen = false;
  this.router.navigate(['/add-customer']);
}

// Método para copiar al portapapeles compatible con Safari
private copyToClipboard(text: string) {
  // Intentar primero con la API moderna de Clipboard
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).catch(() => {
      // Si falla, usar el método alternativo
      this.fallbackCopyToClipboard(text);
    });
  } else {
    // Usar método alternativo para Safari y contextos no seguros
    this.fallbackCopyToClipboard(text);
  }
}

private fallbackCopyToClipboard(text: string) {
  try {
    // Crear un elemento temporal
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Hacer que el textarea no sea visible
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    
    // Conservar la selección original
    const focused = document.activeElement as HTMLElement;
    const selection = document.getSelection()?.rangeCount ? 
                      document.getSelection()?.getRangeAt(0) : null;
    
    // Seleccionar y copiar
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    
    // Limpiar
    document.body.removeChild(textArea);
    
    // Restaurar la selección original si existía
    if (focused && focused.focus) {
      focused.focus();
    }
    if (selection) {
      const sel = document.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(selection);
    }
  } catch (err) {
    this.toast.showToast('No se pudo copiar al portapapeles', 'warning', 5000);
  }
}

}
