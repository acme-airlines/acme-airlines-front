// src/app/models/payment-request.ts
export interface PaymentRequest {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  amount: number;
}
