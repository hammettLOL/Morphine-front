import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BookingManagerDashboardService } from '../../core/services/booking-manager-dashboard.service';
import { BookingManagerOrder, MonthlyCommission } from '../../core/models/booking-manager-dashboard.model';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/enums/role.enum';
import { formatSoles } from '../../core/utils/format.utils';
import { formatDayMonth } from '../../core/utils/period.utils';

// Comision mensual de la booking manager (Susana), por fecha de operacion.
// Admin (Morphine) la usa para saber cuanto pagar; BookingManager para ver cuanto le toca.
@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './commissions.component.html'
})
export class CommissionsComponent implements OnInit {
  year!: number;
  month!: number;
  data?: MonthlyCommission;
  loading = false;
  isAdmin = false;

  readonly formatCurrency = formatSoles;

  private readonly tipoLabels: Record<BookingManagerOrder['tipoComision'], string> = {
    Ninguna: 'Hacia la meta',
    Meta: 'Alcanza meta (fijo)',
    Extra: '5% extra'
  };

  constructor(
    private readonly bmService: BookingManagerDashboardService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.getUserRole() === Role.Admin;
    const params = this.route.snapshot.queryParamMap;
    const today = new Date();
    const year = Number(params.get('anio'));
    const month = Number(params.get('mes'));
    const validParams = Number.isInteger(year) && year > 2000 && Number.isInteger(month) && month >= 1 && month <= 12;

    this.year = validParams ? year : today.getFullYear();
    this.month = validParams ? month : today.getMonth() + 1;
    this.load();
  }

  get monthLabel(): string {
    const label = new Date(this.year, this.month - 1, 1).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  }

  previousMonth(): void {
    this.shiftMonth(-1);
  }

  nextMonth(): void {
    this.shiftMonth(1);
  }

  tipoLabel(tipo: BookingManagerOrder['tipoComision']): string {
    return this.tipoLabels[tipo] ?? '';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  }

  // Fin de semana es exclusivo (lunes siguiente): se muestra el domingo
  formatWeek(inicio: string, fin: string): string {
    const domingo = new Date(fin);
    domingo.setDate(domingo.getDate() - 1);
    return `Lun ${formatDayMonth(new Date(inicio))} - Dom ${formatDayMonth(domingo)}`;
  }

  private shiftMonth(delta: number): void {
    const date = new Date(this.year, this.month - 1 + delta, 1);
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.bmService.getMonthlyCommissions(this.year, this.month).subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: () => {
        this.data = undefined;
        this.loading = false;
      }
    });
  }
}
