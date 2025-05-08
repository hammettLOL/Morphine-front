import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class SpeedDialComponent implements OnInit {
  open = false;
  modalOpen = false;
  generatedLink: string = '';
  showLinkInput = false;
  canShare = false;
  
  constructor(
    private router: Router, 
    private customerService: CustomersService,
    private toast: ToastService) {}
    
  ngOnInit() {
    // Verificar si la API de compartir está disponible
    this.canShare = !!navigator.share;
  }

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.showLinkInput = false;
  }

  handleGenerateLink() {
    this.customerService.generateRegistrationLink().subscribe({
      next: ({ link }) => {
        this.generatedLink = link;
        
        // Detectar si es Safari móvil
        const isMobileSafari = this.detectMobileSafari();
        
        if (isMobileSafari) {
          // Para Safari móvil, mostrar el modal con el link
          this.showLinkInput = true;
          this.toast.showToast('Utiliza los botones para copiar o compartir el enlace', 'warning', 5000);
        } else {
          // Para otros navegadores, intentar copiar automáticamente
          this.copyToClipboard(link);
          this.modalOpen = false;
        }
      },
      error: (error) => {
        this.toast.showToast('Error al generar el link', 'danger', 5000);
        this.modalOpen = false;
      }
    });
  }
  
  // Método para detectar Safari móvil
  private detectMobileSafari(): boolean {
    const ua = navigator.userAgent;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isMobile = /iPhone|iPad|iPod/i.test(ua);
    return isSafari && isMobile;
  }
  
  // Método para el botón "Copiar"
  copyLinkManually() {
    if (this.generatedLink) {
      // En Safari móvil, document.execCommand funciona cuando es en respuesta a un clic
      this.copyToClipboardForMobile(this.generatedLink);
    }
  }
  
  // Método específico para copiar en móvil que responde a un evento de usuario
  private copyToClipboardForMobile(text: string) {
    try {
      // Crear un elemento temporal
      const textArea = document.createElement('textarea');
      textArea.value = text;
      
      // Configurar el textarea
      textArea.style.position = 'fixed';
      textArea.style.left = '0';
      textArea.style.top = '0';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      
      // Seleccionar y copiar
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      
      // Limpiar
      document.body.removeChild(textArea);
      
      if (successful) {
        this.toast.showToast('Link copiado al portapapeles', 'success', 5000);
        // Cerrar el modal después de copiar exitosamente
        setTimeout(() => this.closeModal(), 1000);
      } else {
        this.toast.showToast('No se pudo copiar automáticamente', 'warning', 5000);
      }
    } catch (err) {
      this.toast.showToast('No se pudo copiar al portapapeles', 'warning', 5000);
    }
  }
  
  // Método para compartir el enlace
  shareLink() {
    if (this.generatedLink && navigator.share) {
      navigator.share({
        title: 'Enlace de registro',
        text: 'Aquí tienes tu enlace de registro',
        url: this.generatedLink
      })
      .then(() => {
        this.toast.showToast('Enlace compartido', 'success', 5000);
        this.closeModal();
      })
      .catch(() => {
        this.toast.showToast('No se pudo compartir el enlace', 'warning', 5000);
      });
    } else {
      this.toast.showToast('Compartir no está disponible en este dispositivo', 'warning', 5000);
    }
  }

  // Método para navegadores regulares
  private copyToClipboard(text: string) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.toast.showToast('Link copiado al portapapeles', 'success', 5000);
        })
        .catch(() => {
          this.toast.showToast('No se pudo copiar al portapapeles', 'warning', 5000);
        });
    } else {
      // Fallback para navegadores que no soportan clipboard API
      this.copyToClipboardForMobile(text);
    }
  }

  handleAddCustomer() {
    // Navegas a la ruta agregar cliente
    this.modalOpen = false;
    this.router.navigate(['/add-customer']);
  }
}