import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { WorkOrderDto } from '../../../core/models/work-order-dto.model';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../core/services/modal.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-order-list.component.html',
  styleUrl: './work-order-list.component.css'
})
export class WorkOrderListComponent implements OnInit {
  workOrders: WorkOrderDto[] = [];
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  hasPreviousPage = false;
  hasNextPage = false;
  searchTerm = '';


  statusMap: { [key: number]: string } = {
    0: 'Pendiente',
    1: 'En progreso',
    2: 'Finalizado',
    3: 'Cancelado'
  };

  paymentMethodMap: { [key: number]: string } = {
    0: 'Plin',
    1: 'Yape',
    2: 'Efectivo',
    3: 'Tarjeta',
    4: 'Transferencia'
  };

  constructor(
    private readonly workOrderService: WorkOrderService,
    private readonly router: Router,
    private readonly  toastService: ToastService,
    private readonly modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.loadWorkOrders();
  }

  loadWorkOrders() {
    this.workOrderService.getWorkOrders(this.pageNumber, this.pageSize, this.searchTerm).subscribe((data) => {
      this.workOrders = data.items;
      this.hasPreviousPage = this.pageNumber > 1;
      this.hasNextPage = data.totalPages > this.pageNumber; 
      this.totalPages = data.totalPages;
    });
  }

  addWorkOrder(): void {
      this.router.navigate(['/customers']);
    
  }

  nextPage() {
    this.pageNumber++;
    this.loadWorkOrders();
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadWorkOrders();
    }
  }

  trackByWorkOrderId(index: number, workOrder: WorkOrderDto): number {
      return workOrder.id;
  }

  editWorkOrder(workOrder: WorkOrderDto) {
      // Navegar a la pantalla de edición pasando el ID del cliente
      this.router.navigate(['/edit-work-order', workOrder.id]);
  }

  deleteWorkOrder(workOrder: WorkOrderDto) {
      this.modalService.confirm({message: `Estas seguro de borrar la orden de ${workOrder.customerName}`, title: 'Confirmar Eliminación'}).subscribe((result)=>{
        if (result) {
          this.workOrderService.delete(workOrder.id).subscribe({
            next: () => {
              this.toastService.showToast('Orden eliminada','success');
            // Recarga la lista después de eliminar
              this.loadWorkOrders();
            },
            error: (err) => {
              this.toastService.showToast('Error al eliminar la orden','danger');
            }
          });
        }
      });
    }

    onSearchTermChange(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.pageNumber = 1;
      this.loadWorkOrders();
    }

}
