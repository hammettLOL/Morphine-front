import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { forkJoin } from 'rxjs';
import { WorkOrderPreview } from '../../../core/models/work-order-preview.model';
import { Router } from '@angular/router';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-preview-work-order',
  providers: [
      { provide: LOCALE_ID, useValue: 'es' } // Establecer español como locale por defecto
    ],
  imports: [CommonModule],
  standalone: true,
  templateUrl: './preview-work-order.component.html',
  styleUrl: './preview-work-order.component.css'
})
export class PreviewWorkOrderComponent implements OnInit {
  @Input () workOrderId!: number | undefined;
  loading = true;
  error: any;
  workOrderPreview: any;

  constructor(
    private readonly toastService: ToastService,
    private readonly workOrderService: WorkOrderService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.loadPreviewWorkOrder();
  }

  loadPreviewWorkOrder() {
    if(this.workOrderId) {
      this.loading = true;
      forkJoin({
        workOrder: this.workOrderService.getWorkOrderPreview(this.workOrderId)
      }).subscribe({
        next:({ workOrder }) => {
          this.setFormValues(workOrder);
          this.loading = false;
        },
        error: (err) => {
          this.toastService.showToast('Error al cargar la orden de trabajo', 'danger');
          this.loading = false;
           this.router.navigate(['/work-orders']);
        }
      });
    }
  }
  setFormValues(workOrders: WorkOrderPreview) {
    this.workOrderPreview = workOrders;
  }

  copyClientInfo(): void {
      // Crear texto formateado con la información del cliente
      const clientInfo = `
        Cliente: ${this.workOrderPreview.customerName}
        Documento: ${this.workOrderPreview.document}
        Teléfono: ${this.workOrderPreview.cellphone}
        Email: ${this.workOrderPreview.email}
        Fecha: ${new Date(this.workOrderPreview.dateTime).toISOString().split('T')[0]}
        Hora: ${new Date(this.workOrderPreview.dateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}
        Monto: S/ ${this.workOrderPreview.totalPrice.toFixed(2)}
        Referencia: ${this.workOrderPreview.reference}
      `.replace(/^\s+/gm, '').trim();
      
      // Usar la API del portapapeles, compatible con Safari en iOS 13.4+
      if (navigator.clipboard) {
        navigator.clipboard.writeText(clientInfo.trim())
          .then(() => {
            this.toastService.showToast('Información copiada al portapapeles', 'success');
          })
          .catch(err => {
            console.error('Error al copiar: ', err);
            this.fallbackCopyTextToClipboard(clientInfo);
          });
      } else {
        this.fallbackCopyTextToClipboard(clientInfo);
      }
    }
    
    // Método alternativo para copiar en navegadores más antiguos
    fallbackCopyTextToClipboard(text: string): void {
      const textArea = document.createElement('textarea');
      textArea.value = text.trim();
      
      // Hacer que el textarea esté fuera de la pantalla
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      
      // Preservar la selección original
      const selected = document.getSelection()!.rangeCount > 0 
          ? document.getSelection()!.getRangeAt(0) : null;
      
      textArea.select();
      
      // Usar document.execCommand que está mejor soportado en Safari para iOS
      let successful = false;
      try {
        successful = document.execCommand('copy');
      } catch (err) {
        console.error('Error al copiar texto: ', err);
      }
      
      document.body.removeChild(textArea);
      
      // Restaurar la selección original si existía
      if (selected) {
        document.getSelection()!.removeAllRanges();
        document.getSelection()!.addRange(selected);
      }
      
      if (successful) {
        this.toastService.showToast('Información copiada al portapapeles', 'success');
      } else {
        this.toastService.showToast('No se pudo copiar la información', 'danger');
      }
    }

     shareClientInfo(): void {
      // Crear objeto con datos para compartir
      const shareData = {
        title: `Información de Cliente: ${this.workOrderPreview.customerName}`,
        text: `Cliente: ${this.workOrderPreview.customerName}
               Documento: ${this.workOrderPreview.document}
               Teléfono: ${this.workOrderPreview.cellphone}
               Email: ${this.workOrderPreview.email}
               Fecha: ${new Date(this.workOrderPreview.dateTime).toISOString().split('T')[0]}
               Hora: ${new Date(this.workOrderPreview.dateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })}
               Monto: S/ ${this.workOrderPreview.totalPrice.toFixed(2)}
               Referencia: ${this.workOrderPreview.reference}`.replace(/^\s+/gm, '').trim(),
        // URL opcional si quisieras incluirla
        // url: window.location.href
      };
      
      // Verificar si el navegador soporta la API Web Share
      // Esta API funciona muy bien en Safari para iOS
      if (navigator.share) {
        navigator.share(shareData)
          .then(() => {
            this.toastService.showToast('Información compartida exitosamente', 'success');
          })
          .catch((error) => {
            this.toastService.showToast('Error al compartir la información', 'danger');
            this.showShareFallback();
          });
      } else {
        // Fallback para navegadores que no soportan Web Share API
        this.showShareFallback();
      }
    }
    
    showShareFallback(): void {
      // Alternativa para compartir cuando la API no está disponible
      // Podrías mostrar un diálogo con opciones de compartir manualmente
      // o copiar al portapapeles
      this.toastService.showToast('No se pudo compartir la información', 'danger');
    }

}
