import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Billing, BillingRequest } from '../models/billing.requests';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private billingUrl = 'http://localhost:9090/Billing';

  constructor(private httpClient: HttpClient) { }

  addBilling(authorizationHeader: string, billingRequest: BillingRequest): Observable<Billing> {
    const headers = new HttpHeaders({ 'Authorization': authorizationHeader });
    return this.httpClient.post<Billing>(`${this.billingUrl}/addBilling`, billingRequest, {headers})
  }

  findByBookingId(bookingId: string): Observable<Billing> {
    return this.httpClient.get<Billing>(`${this.billingUrl}/findByBookingId/${bookingId}`);
  }

  initiatePayment(billingId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.billingUrl}/pay/${billingId}`);
  }
}
