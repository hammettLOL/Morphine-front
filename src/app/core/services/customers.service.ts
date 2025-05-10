// src/app/services/customers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../models/paged-result.model';
import { Customer } from '../models/customer.model';
import { environment } from '../../../environments/environment';
import { CustomerByDocument } from '../models/customer-by-document.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private readonly apiUrl = environment.baseUrl;
  private readonly endpoint ='api/customers'; 

  constructor(private readonly http: HttpClient) {}

  validateToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.endpoint}/validate-customer-token/${token}`);
  }

  addCustomerByToken(token: string, customer: Customer): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.endpoint}/add-customer-token/${token}`,customer);
  }

  getCustomers(pageNumber: number, pageSize: number, search: string = ''): Observable<PagedResult<Customer>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('search', search);
    return this.http.get<PagedResult<Customer>>(`${this.apiUrl}/${this.endpoint}`, { params });
  }

  getCustomer(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${this.endpoint}/${customerId}`);
  }
  addCustomer(customer: Customer): Observable<any> {
    return this.http.post(`${this.apiUrl}/${this.endpoint}`, customer);
  }

  updateCustomer(customer: Customer): Observable<any> {
    return this.http.put(`${this.apiUrl}/${this.endpoint}/${customer.id}`, customer);
  }

  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${this.endpoint}/${customerId}`);
  }

  generateRegistrationLink(): Observable<any> {
    return this.http.get(`${this.apiUrl}/${this.endpoint}/generate-registration-link`);
  }
  findCustomerByDocumentNumber(token: string, typeDocument: string, documentNumber: string): Observable<CustomerByDocument> {
    const params = new HttpParams()
      .set('token', token)
      .set('typeDocument', typeDocument)
      .set('documentNumber', documentNumber);
    return this.http.get<Customer>(`${this.apiUrl}/${this.endpoint}/get-customer-by-document`, { params });
  }
    
}
