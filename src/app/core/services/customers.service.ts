// src/app/services/customers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id: number;
  document: string;
  typeDocument: number
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
  private readonly apiUrl = 'http://localhost:5102/';
  private readonly endpoint ='api/customers'; 

  constructor(private readonly http: HttpClient) {}

  validateToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.endpoint}/validate-customer-token/${token}`);
  }

  addCustomerByToken(token: string, customer: Customer): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.endpoint}/add-customer-token/${token}`,customer);
  }

  getCustomers(pageNumber: number, pageSize: number): Observable<Customer[]> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<Customer[]>(`${this.apiUrl}${this.endpoint}`, { params });
  }

  getCustomer(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}${this.endpoint}/${customerId}`);
  }
  addCustomer(customer: Customer): Observable<any> {
    return this.http.post(`${this.apiUrl}${this.endpoint}`, customer);
  }

  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(`${this.apiUrl}${this.endpoint}/${customer.id}`, customer);
  }

  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${this.endpoint}/${customerId}`);
  }

  generateRegistrationLink(): Observable<any> {
    return this.http.get(`${this.apiUrl}${this.endpoint}/generate-registration-link`);
  }
}
