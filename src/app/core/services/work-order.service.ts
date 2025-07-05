// src/app/services/work-order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkOrder } from '../models/work-order.model';
import { WorkOrderDto } from '../models/work-order-dto.model';
import { PagedResult } from '../models/paged-result.model';
import { environment } from '../../../environments/environment';
import { WorkOrderPreview } from '../models/work-order-preview.model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  // Ajusta la URL base a la configuración de tu backend
  private readonly apiUrl = environment.baseUrl;
  private readonly endpoint ='api/workorders'; 

  constructor(private readonly http: HttpClient) {}

  // Obtener todas las órdenes de trabajo
  getWorkOrders(pageNumber: number, pageSize: number, search: string = '', year: number = 0, month: number = 0, schedulerId: number = 0): Observable<PagedResult<WorkOrderDto>> {
      let params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString());
        if (search.trim()) params = params.set('search', search.trim());
        if (year)          params = params.set('year',  year.toString());
        if (month)         params = params.set('month', month.toString());
        if (schedulerId)   params = params.set('schedulerId', schedulerId.toString());
        
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
  
  getWorkOrderPreview(id: number): Observable<WorkOrderPreview> {
    return this.http.get<WorkOrderPreview>(`${this.apiUrl}/${this.endpoint}/preview/${id}`);
  }
  addWorkOrderByToken(token: string, workOrder: WorkOrder): Observable<WorkOrder> {
    return this.http.post<WorkOrder>(`${this.apiUrl}/${this.endpoint}/add-workOrder-token/${token}`, workOrder);
  }
}
