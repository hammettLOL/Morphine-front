// src/app/components/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DashboardMetrics, DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  periodForm!: FormGroup;
  metrics?: DashboardMetrics;
  loading = false;
  showMetrics = false;
  today = new Date();
  years: number[] = [];
  months = [
    {value: 1, name: 'Enero'},
    {value: 2, name: 'Febrero'},
    {value: 3, name: 'Marzo'},
    {value: 4, name: 'Abril'},
    {value: 5, name: 'Mayo'},
    {value: 6, name: 'Junio'},
    {value: 7, name: 'Julio'},
    {value: 8, name: 'Agosto'},
    {value: 9, name: 'Septiembre'},
    {value: 10, name: 'Octubre'},
    {value: 11, name: 'Noviembre'},
    {value: 12, name: 'Diciembre'}
  ];

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.generateYears();
  }

  private initializeForm(): void {
    this.periodForm = this.fb.group({
      year: [this.today.getFullYear(), Validators.required],
      month: [this.today.getMonth() + 1, Validators.required]
    });
  }

  private generateYears(): void {
    const currentYear = this.today.getFullYear();
    // Generar años desde 2024 hasta el año actual
    for (let y = 2024; y <= currentYear; y++) {
      this.years.push(y);
    }
    this.limitMonth();
  }

  // Impide elegir mes/año en el futuro
  limitMonth(): void {
    const selectedYear = this.periodForm.value.year!;
    if (selectedYear === this.today.getFullYear() && this.periodForm.value.month! > this.today.getMonth() + 1) {
      this.periodForm.patchValue({ month: this.today.getMonth() + 1 });
    }
  }

  onYearChange(): void {
    this.limitMonth();
    // Reset metrics when year changes
    this.showMetrics = false;
    this.metrics = undefined;
  }

  onMonthChange(): void {
    // Reset metrics when month changes
    this.showMetrics = false;
    this.metrics = undefined;
  }

  loadMetrics(): void {
    if (this.periodForm.invalid) {
      this.periodForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { year, month } = this.periodForm.value;

    this.dashboardService.getMetricsByPeriod(year, month).subscribe({
      next: (data: DashboardMetrics) => {
        this.metrics = data;
        this.showMetrics = true;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener métricas:', err);
        this.loading = false;
      }
    });
  }
}