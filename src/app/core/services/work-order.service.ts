// src/app/services/work-order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export enum Status {
  Pendiente = 0,
  EnProgreso = 1,
  Completado = 2,
  Cancelado = 3
}

export enum PaymentMethod {
  Plin = 0,
  Yape = 1,
  Efectivo = 2,
  Tarjeta = 3,
  Transferencia = 4
}

export enum Scheduler {
  Morphine = 1,
  LimaEspacio = 2
}
export interface WorkOrderDto{
  id: number,
  customerId: number,
  customerName: string,
  schedulerId: number,
  schedulerName: string,
  description: string,
  serviceId: number,
  serviceType: string,
  status: Status,
  paymentMethod: PaymentMethod,
  scheduleDate: string,
  advancePrice: number,
  totalPrice: number
}
export interface WorkOrder {
  id: number;
  customerId: number;
  schedulerId: number;
  serviceId: number;
  description?: string;
  status: Status;
  advancePrice?: number;
  totalPrice?: number;
  scheduleDate?: Date;          // Se espera un valor Date en el backend (DateTime?)  
  createdAt?: Date;
  updatedAt?: Date;
  paymentMethod?: PaymentMethod;

  // Propiedades opcionales para mostrar datos relacionados sin hacer consultas adicionales.
  // Por ejemplo, se pueden llenar en el backend mediante JOIN o mediante DTO.
  customerName?: string; 
  serviceType?: string;
}


@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  // Ajusta la URL base a la configuración de tu backend
  private readonly apiUrl = 'http://localhost:5102';
  private readonly endpoint ='api/workorders'; 

  constructor(private readonly http: HttpClient) {}

  // Obtener todas las órdenes de trabajo
  getWorkOrders(pageNumber: number, pageSize: number): Observable<WorkOrderDto[]> {
      const params = new HttpParams()
        .set('pageNumber', pageNumber.toString())
        .set('pageSize', pageSize.toString());
      return this.http.get<WorkOrderDto[]>(`${this.apiUrl}/${this.endpoint}`, { params });
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
