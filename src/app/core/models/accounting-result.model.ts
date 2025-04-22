import { AccountingWorkOrder } from "./accounting-work-order.model";

export interface AccountingResult {
    items: AccountingWorkOrder[];
    totalAmount: number;
}