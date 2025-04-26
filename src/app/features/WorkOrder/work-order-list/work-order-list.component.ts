import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { WorkOrderDto } from '../../../core/models/work-order-dto.model';
import { ActivatedRoute, Router } from '@angular/router';
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
  today = new Date();
  year  = this.today.getFullYear();
  month = this.today.getMonth() + 1;
  months = [
    { value:1, name:'Enero'},{ value:2, name:'Febrero'},{ value:3, name:'Marzo' },
    { value:4, name:'Abril'},{ value:5, name:'Mayo'},{ value:6, name:'Junio' },
    { value:7, name:'Julio'},{ value:8, name:'Agosto'},{ value:9, name:'Septiembre' },
    { value:10, name:'Octubre'},{ value:11, name:'Noviembre'},{ value:12, name:'Diciembre' }
  ];
  years: number[] = [];
  


  statusMap: { [key: number]: string } = {
    0: 'Pendiente',
    1: 'En progreso',
    2: 'Finalizado',
    3: 'Cancelado'
  };

  paymentMethodMap: { [key: number]: string } = {
    0: 'Plin',
    1: 'Yape',
    2: 'Tarjeta',
    3: 'Efectivo',
    4: 'Transferencia'
  };

  constructor(
    private readonly workOrderService: WorkOrderService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly  toastService: ToastService,
    private readonly modalService: ModalService
  ) {}

  ngOnInit(): void {
    const currentYear = this.today.getFullYear();
    for (let y = 2024; y <= currentYear; y++) {
      this.years.push(y);
    }

    this.route.queryParams.subscribe(params => {
      this.pageNumber = +params['pageNumber'] || 1;
      // Aquí comprobamos si viene explicitamente el parámetro,
      // aunque sea “0”, y si no, dejamos 0 por defecto.
      this.year  = params['year']  !== undefined ? +params['year']  : 0;
      this.month = params['month'] !== undefined ? +params['month'] : 0;

      this.loadWorkOrders();
    });
   
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
    const qp: any = { pageNumber: 1 };
    qp.month = m !== 0 ? m : null;       // null eliminará el param
    this.router.navigate(
    ['/work-orders'],
    { queryParams: qp, queryParamsHandling: 'merge' }
    );
  }

  onYearChange(y: number) {
    const qp: any = { pageNumber: 1 };
    qp.year = y !== 0 ? y : null;
    this.router.navigate(
      ['/work-orders'],
      { queryParams: qp, queryParamsHandling: 'merge' }
    );
  }

  addWorkOrder(): void {
      this.router.navigate(['/customers']);
    
  }

  nextPage() {
    this.pageNumber++;
    this.router.navigate(
      ['/work-orders'],
      { queryParams: { pageNumber: this.pageNumber},
        queryParamsHandling: 'merge'
    }
    );
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.router.navigate(
        ['/work-orders'],
        { queryParams: { pageNumber: this.pageNumber},
          queryParamsHandling: 'merge'
      }
      );
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
