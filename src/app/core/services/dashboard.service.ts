// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private readonly apiUrl = environment.baseUrl;
 

  constructor(private readonly http: HttpClient) {}

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/${this.endpoint}`);
  }
}
