import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingManagerDashboardService } from '../../core/services/booking-manager-dashboard.service';
import { BookingManagerDashboard } from '../../core/models/booking-manager-dashboard.model';
import { WorkOrderService } from '../../core/services/work-order.service';
import { WorkOrderDto } from '../../core/models/work-order-dto.model';
import {
  FridayPeriod,
  getCurrentFridayPeriod,
  getNextPeriod,
  getPreviousPeriod,
  formatPeriodLabel,
  toISODate
} from '../../core/utils/period.utils';

@Component({
  selector: 'app-booking-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-manager-dashboard.component.html',
  styleUrls: ['./booking-manager-dashboard.component.scss']
})
export class BookingManagerDashboardComponent implements OnInit {
  currentPeriod!: FridayPeriod;
  periodLabel = '';
  dashboard?: BookingManagerDashboard;
  loading = false;

  // Modal detalle
  isDetailOpen = false;
  detailLoading = false;
  selectedOrder?: WorkOrderDto;

  private readonly statusMap: Record<number, string> = {
    0: 'Pendiente', 1: 'En progreso', 2: 'Completado', 3: 'Cancelado'
  };
  private readonly paymentMethodMap: Record<number, string> = {
    0: 'Plin', 1: 'Yape', 2: 'Tarjeta', 3: 'Efectivo', 4: 'Transferencia'
  };

  constructor(
    private readonly bmService: BookingManagerDashboardService,
    private readonly workOrderService: WorkOrderService
  ) {}

  ngOnInit(): void {
    this.currentPeriod = getCurrentFridayPeriod();
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.periodLabel = formatPeriodLabel(this.currentPeriod);
    const startDate = toISODate(this.currentPeriod.start);
    const endDate = toISODate(this.currentPeriod.end);

    this.bmService.getDashboard(startDate, endDate).subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  previousPeriod(): void {
    this.currentPeriod = getPreviousPeriod(this.currentPeriod);
    this.loadDashboard();
  }

  nextPeriod(): void {
    this.currentPeriod = getNextPeriod(this.currentPeriod);
    this.loadDashboard();
  }

  openDetail(orderId: number): void {
    this.detailLoading = true;
    this.isDetailOpen = true;
    this.workOrderService.getById(orderId).subscribe({
      next: (order) => {
        this.selectedOrder = order;
        this.detailLoading = false;
      },
      error: () => {
        this.detailLoading = false;
        this.isDetailOpen = false;
      }
    });
  }

  closeDetail(): void {
    this.isDetailOpen = false;
    this.selectedOrder = undefined;
  }

  getStatusLabel(status: number): string {
    return this.statusMap[status] ?? 'Desconocido';
  }

  getPaymentMethodLabel(method: number): string {
    return this.paymentMethodMap[method] ?? '-';
  }

  private readonly ARC_TOTAL = 251.33;

  get progressPercent(): number {
    if (!this.dashboard) return 0;
    return Math.min(100, (this.dashboard.totalAgendado / this.dashboard.meta) * 100);
  }

  get arcLength(): string {
    return `${this.ARC_TOTAL}`;
  }

  get arcOffset(): string {
    const filled = (this.progressPercent / 100) * this.ARC_TOTAL;
    return `${this.ARC_TOTAL - filled}`;
  }

  formatCurrency(value: number): string {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }
}
