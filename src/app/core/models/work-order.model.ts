import { PaymentMethod } from "../enums/payment-method.enum";
import { Status } from "../enums/status.enum";

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