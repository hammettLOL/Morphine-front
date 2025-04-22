import { PaymentMethod } from "../enums/payment-method.enum";

export interface AccountingWorkOrder {
    id: number;
    workOrderId: number;
    customerName: string;
    description: string;
    scheduledDate: string;
    paymentMethod: PaymentMethod;
    advancePrice: number;
    totalPrice: number;
    verified: boolean;
    remarks: string;
    emitted: boolean;
    amount: number;
}