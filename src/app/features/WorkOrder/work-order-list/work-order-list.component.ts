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
  workOrders?: WorkOrderDto[] = undefined;
  pageNumber = 1;
  pageSize = 10;
  totalPages = 1;
  hasPreviousPage = false;
  hasNextPage = false;
  searchTerm = '';
  year: number = 0;
  month: number = 0;
  months = [
    { value:1, name:'Enero'},{ value:2, name:'Febrero'},{ value:3, name:'Marzo' },
    { value:4, name:'Abril'},{ value:5, name:'Mayo'},{ value:6, name:'Junio' },
    { value:7, name:'Julio'},{ value:8, name:'Agosto'},{ value:9, name:'Septiembre' },
    { value:10, name:'Octubre'},{ value:11, name:'Noviembre'},{ value:12, name:'Diciembre' }
  ];
  years: number[] = [];
  today = new Date();


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
  ) {}

  ngOnInit(): void {
    const currentYear = this.today.getFullYear();
    for (let y = 2024; y <= currentYear; y++) {
      this.years.push(y);
    }
    this.loadWorkOrders();
  }

  loadWorkOrders() {
    this.workOrderService.getWorkOrders(this.pageNumber, this.pageSize, this.searchTerm, this.year, this.month).subscribe((data) => {
      this.workOrders = data.items;
      this.hasPreviousPage = this.pageNumber > 1;
      this.hasNextPage = data.totalPages > this.pageNumber; 
      this.totalPages = data.totalPages;
    });
  }

  onMonthChange(m: number) {
    this.month = m;
    this.pageNumber = 1;
    this.loadWorkOrders();
  }

  onYearChange(y: number) {
    this.year = y;
    this.pageNumber = 1;
    this.loadWorkOrders();
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
