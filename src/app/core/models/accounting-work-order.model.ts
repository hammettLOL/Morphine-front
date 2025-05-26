import { PaymentMethod } from "../enums/payment-method.enum";

export interface AccountingWorkOrder {
    id: number;
    workOrderId: number;
    customerName: string;
    dni: string;
    email: string;
    schedulerName: string;
    scheduledDate: string;
    paymentMethod: PaymentMethod;
    paymentMethodAdvance: PaymentMethod;
    advancePrice: number;
    totalPrice: number;
    verified: boolean;
    remarks: string;
    emitted: boolean;
    amount: number;
    original: {
        verified: boolean;
        remarks: string;
        emitted: boolean;
        amount: number;
      };
      isModified: boolean;
}