import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardMetrics, DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  metrics?: DashboardMetrics;

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getMetrics().subscribe({
      next: (data: DashboardMetrics) => this.metrics = data,
      error: (err) => console.error('Error al obtener métricas:', err)
    });
  }
}
