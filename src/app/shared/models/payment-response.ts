// src/app/models/payment-response.ts
export interface PaymentResponse {
  transactionId: string;
  status: string; // “APPROVED” o “DECLINED”
  message: string;
}
