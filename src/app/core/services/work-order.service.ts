// src/app/services/work-order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

export interface WorkOrder {
  id: number;
  customerId: number;
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
  getAll(): Observable<WorkOrder[]> {
    return this.http.get<WorkOrder[]>(`{this.apiUrl}/${this.endpoint}`);
  }

  // Obtener una orden de trabajo por ID
  getById(id: number): Observable<WorkOrder> {
    return this.http.get<WorkOrder>(`${this.apiUrl}/{this.endpoint}/${id}`);
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
