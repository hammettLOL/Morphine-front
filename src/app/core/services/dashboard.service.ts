// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardMetrics {
  totalCustomers: number;
  totalTattoos: number;
  appointmentsMonth: number;
  revenueMonth: number;
  totalRevenue: number;
  totalLimaEspacioRevenue: number;
  totalMorphineRevenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly endpoint = 'api/dashboard';
  private readonly apiUrl = "http://localhost:5102";
 

  constructor(private readonly http: HttpClient) {}

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/${this.endpoint}`);
  }
}
