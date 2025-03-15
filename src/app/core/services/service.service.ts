import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Service {
  id: number;
  type: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private readonly apiUrl = 'http://localhost:5102/';
  private readonly endpoint ='api/services'; 

  constructor(private readonly http: HttpClient) { }

  getServices(pageNumber: number, pageSize: number): Observable<Service[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<Service[]>(`${this.apiUrl}${this.endpoint}`, { params });
  }

  getService(serviceId: number): Observable<Service> {
    return this.http.get<Service>(`${this.apiUrl}${this.endpoint}/${serviceId}`);
  }
  addService(service: Service): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.endpoint}`, service);
  }

  updateService(service: Service): Observable<any> {
    return this.http.put(`${this.apiUrl}${this.endpoint}/${service.id}`, service);
  }

  deleteService(serviceId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.endpoint}/${serviceId}`);
  }
}
