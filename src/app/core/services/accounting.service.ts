import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AccountingWorkOrder } from '../models/accounting-work-order.model';
import { AccountingResult } from '../models/accounting-result.model';
import { CreateAccountingWorkOrders } from '../models/create-accounting-work-orders.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

   // Ajusta la URL base a la configuración de tu backend
   private readonly apiUrl = environment.baseUrl;
   private readonly endpoint ='api/accountingWorkOrder'; 
  constructor(
    private readonly http: HttpClient
  ) { }

    createAccountingWorkOrders(createAccountingWorkOrders: CreateAccountingWorkOrders): Observable<AccountingResult>{
        return this.http.post<AccountingResult>(`${this.apiUrl}/${this.endpoint}`, createAccountingWorkOrders);
      }
      getAccountingWorkOrders(year: number, month: number): Observable<AccountingResult>{
        const params = new HttpParams()
          .set('year', year.toString())
          .set('month', month.toString());
        return this.http.get<AccountingResult>(`${this.apiUrl}/${this.endpoint}`, { params });
      }

  update(id: number, accountingWorkOrder: AccountingWorkOrder): Observable<AccountingWorkOrder> {
    return this.http.put<AccountingWorkOrder>(`${this.apiUrl}/${this.endpoint}/${id}`, accountingWorkOrder);
  }
  
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${this.endpoint}/${id}`);
  }
}
