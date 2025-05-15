import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { WorkOrderDto } from '../../../core/models/work-order-dto.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../core/services/modal.service';
import { FormsModule } from '@angular/forms';
import { EditWorkOrderComponent } from '../../WorkOrder/edit-work-order/edit-work-order.component';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, EditWorkOrderComponent],
  templateUrl: './work-order-list.component.html',
  animations: [
      trigger('modalAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('150ms ease-out', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          animate('120ms ease-in', style({ opacity: 0 }))
        ])
      ]),
      trigger('contentAnimation', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          animate('200ms 50ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
          animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
        ])
      ])
    ]
})
export class WorkOrderListComponent implements OnInit {
  workOrders?: WorkOrderDto[] = undefined;
  isModalOpen = false;
  isModalPreviewOpen = false;
  selectedWorkOrderId: number | undefined;
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

    editWorkOrder(workOrder: WorkOrderDto) {
      this.selectedWorkOrderId = workOrder.id;
      this.isModalOpen = true;
    }
    previewWorkOrder(workOrder: WorkOrderDto) {
      this.selectedWorkOrderId = workOrder.id;
      this.isModalPreviewOpen = true;
    }

    closeEditModal() {
      this.isModalOpen = false;
      this.selectedWorkOrderId = undefined;
    }
     closePreviewModal() {
      this.isModalPreviewOpen = false;
      this.selectedWorkOrderId = undefined;
    }

    onWorkOrderCanceled() {
      this.closeEditModal();
      this.loadWorkOrders();
    }

    onWorkOrderSaved(workOrder: any) {
      this.workOrderService.update(workOrder.id, workOrder).subscribe({
        next: () => {
          this.toastService.showToast('Orden de trabajo actualizada correctamente','success');
          this.closeEditModal();
          this.loadWorkOrders();
        },
        error: (err) => {
          this.toastService.showToast('Error al actualizar la orden de trabajo','danger');
        }
      });
      
    }

}
