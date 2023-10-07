export class Billing {
  billId: string;
  bookingId: string;
  billAmount: number;
  paymentStatus: PaymentStatus;

  constructor(
    billId: string,
    bookingId: string,
    billAmount: number,
    paymentStatus: PaymentStatus
  ) {
    this.billId = billId;
    this.bookingId = bookingId;
    this.billAmount = billAmount;
    this.paymentStatus = paymentStatus;
  }
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}
export interface BillingRequest {
  bookingId: string;
}
