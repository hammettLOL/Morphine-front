import { PaymentMethod } from "../enums/payment-method.enum";
import { Status } from "../enums/status.enum";

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
  paymentMethodAdvance: PaymentMethod,
  creationDate: string,
  scheduleDate: string,
  advancePrice: number,
  totalPrice: number,
  percentage: number,
  duration:number
}