import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BookingManagerDashboard, MonthlyCommission } from '../models/booking-manager-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class BookingManagerDashboardService {
  private readonly apiUrl = `${environment.baseUrl}/api/dashboard-bm`;

  constructor(private readonly http: HttpClient) {}

  getDashboard(startDate: string, endDate: string): Observable<BookingManagerDashboard> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<BookingManagerDashboard>(this.apiUrl, { params });
  }

  getMonthlyCommissions(year: number, month: number): Observable<MonthlyCommission> {
    const params = new HttpParams()
      .set('year', year)
      .set('month', month);
    return this.http.get<MonthlyCommission>(`${this.apiUrl}/comisiones`, { params });
  }
}
