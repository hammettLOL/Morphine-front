// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardMetrics {
  // Métricas principales solicitadas por Morphine
  totalGeneralIncome: number;        // Total general de ingresos (% que el cliente paga en ese mes)
  limaEspacioIncome: number;         // Total que Lima Espacio le ha dado en ese mes con sus citas
  morphineScheduledForLimaEspacio: number; // Total que Morphine agendó a Lima Espacio (por fecha de creación)
  totalEmittedSunat: number;         // Total emitido en SUNAT

  // Métricas adicionales para desglose
  morphineOwnIncome: number;         // Ingresos de citas agendadas por Morphine
  totalCompletedAppointments: number; // Total de citas terminadas
  morphineScheduledAppointments: number; // Citas agendadas por Morphine
  limaEspacioAppointments: number;   // Citas de Lima Espacio
  totalEmittedInvoices: number;      // Número de facturas emitidas

 
  // Información del período
  year: number;
  month: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly endpoint = 'api/dashboard';
  private readonly apiUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  // Nuevo método que necesita Morphine: métricas por período específico
  getMetricsByPeriod(year: number, month: number): Observable<DashboardMetrics> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/${this.endpoint}`, { params });
  }
}