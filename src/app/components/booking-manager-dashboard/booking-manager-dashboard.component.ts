import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingManagerDashboardService } from '../../core/services/booking-manager-dashboard.service';
import { BookingManagerDashboard } from '../../core/models/booking-manager-dashboard.model';
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
  imports: [CommonModule, RouterLink],
  templateUrl: './booking-manager-dashboard.component.html',
  styleUrls: ['./booking-manager-dashboard.component.scss']
})
export class BookingManagerDashboardComponent implements OnInit {
  currentPeriod!: FridayPeriod;
  periodLabel = '';
  dashboard?: BookingManagerDashboard;
  loading = false;

  constructor(private readonly bmService: BookingManagerDashboardService) {}

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

  get progressPercent(): number {
    if (!this.dashboard) return 0;
    return Math.min(100, (this.dashboard.totalAgendado / this.dashboard.meta) * 100);
  }

  formatCurrency(value: number): string {
    return `S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  }
}
