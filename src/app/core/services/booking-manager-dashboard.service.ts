import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BookingManagerDashboard } from '../models/booking-manager-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class BookingManagerDashboardService {
  private readonly apiUrl = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getDashboard(startDate: string, endDate: string): Observable<BookingManagerDashboard> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<BookingManagerDashboard>(
      `${this.apiUrl}/api/dashboard-bm`, { params }
    );
  }
}
