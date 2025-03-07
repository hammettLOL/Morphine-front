// src/app/services/customers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: number;
  dni: string;
  name: string;
  lastName: string;
  email: string;
  birthday: string;
  cellphone: string;
  instagram: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private readonly apiUrl = 'http://localhost:5102/api/customers';

  constructor(private readonly http: HttpClient) {}

  getCustomers(pageNumber: number, pageSize: number): Observable<Customer[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<Customer[]>(this.apiUrl, { params });
  }


  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${customerId}`);
  }
}
