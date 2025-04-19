// src/app/services/work-order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkOrder } from '../models/work-order.model';
import { WorkOrderDto } from '../models/work-order-dto.model';
import { PagedResult } from '../models/paged-result.model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  // Ajusta la URL base a la configuración de tu backend
  private readonly apiUrl = 'http://localhost:5102';
  private readonly endpoint ='api/workorders'; 

  constructor(private readonly http: HttpClient) {}

  // Obtener todas las órdenes de trabajo
  getWorkOrders(pageNumber: number, pageSize: number, search: string = ''): Observable<PagedResult<WorkOrderDto>>{
      const params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString())
        .set( 'search', search);
      return this.http.get<PagedResult<WorkOrderDto>>(`${this.apiUrl}/${this.endpoint}`, { params });
    }

  // Obtener una orden de trabajo por ID
  getById(id: number): Observable<WorkOrderDto> {
    return this.http.get<WorkOrderDto>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }

  // Crear una nueva orden de trabajo
  create(workOrder: WorkOrder): Observable<WorkOrder> {
    return this.http.post<WorkOrder>(`${this.apiUrl}/${this.endpoint}`, workOrder);
  }

  // Actualizar una orden de trabajo existente
  update(id: number, workOrder: WorkOrder): Observable<WorkOrder> {
    return this.http.put<WorkOrder>(`${this.apiUrl}/${this.endpoint}/${id}`, workOrder);
  }

  // Eliminar una orden de trabajo
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }
}
