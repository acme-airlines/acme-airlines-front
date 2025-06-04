// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest } from '../models/payment-request';
import { PaymentResponse } from '../models/payment-response';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  constructor(private http: HttpClient) {}

  chargeCard(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(environment.api.postPayment, request);
  }
}
