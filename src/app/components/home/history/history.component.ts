import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { Billing } from 'src/app/models/billing.requests';
import { Booking, BookingStatus } from 'src/app/models/booking.requests';
import { UserDetails } from 'src/app/models/user.requests';
import { BillingService } from 'src/app/services/billing.service';
import { BookingService } from 'src/app/services/booking.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { JwtService } from 'src/app/services/jwt/jwt.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
})
export class HistoryComponent {
  userDetails!: UserDetails;
  bookingDetails: Booking[] = [];
  billId: string = '';
  bookingId: string = '';
  billAmount: number = 0;
  paymentStatus: string = '';
  hName: string = '';

  constructor(
    private jwtService: JwtService,
    private ngToast: NgToastService,
    private bookingService: BookingService,
    private billingService: BillingService,
    private hospitalService: HospitalService
  ) { }

  //View specific bookings based on status on component load
  ngOnInit() {
    this.userDetails = this.jwtService.getUserDetails()!;

    this.bookingService
      .getBookingsByPatientId(this.userDetails.referenceId)
      .subscribe(
        (response) => {
          this.bookingDetails = response;
          this.bookingDetails = this.bookingDetails.filter((booking) => {
            return (
              booking.bookingStatus === BookingStatus.CANCELLED ||
              booking.bookingStatus === BookingStatus.COMPLETED ||
              booking.bookingStatus === BookingStatus.DECLINED
            );
          });
        },
        (error: HttpErrorResponse) => {
          this.handleError("Couldn't fetch booking details", error.error);
        }
      );
  }

  //Function to get the billing details of a particular booking
  viewBill(booking: Booking) {
    this.billingService.findByBookingId(booking.bookingId).subscribe(
      (response) => {

        this.hospitalService.getHospitalById(booking.hospitalId).subscribe(
          (response) => {
            this.hName = response.hospitalName;
            // console.log(this.hName);
          },
          (error: HttpErrorResponse) => {
            this.handleError('Error', error.error);
          })
        this.billId = response.billId;
        this.bookingId = response.bookingId;
        this.billAmount = response.billAmount;
        this.paymentStatus = response.paymentStatus;
      },
      (error: HttpErrorResponse) => {
        this.handleError(
          'Error in fetching booking details!',
          error.error
        );
      }
    );
  }

  //Function to call the payment service
  payBill() {
    this.billingService.initiatePayment(this.billId).subscribe({
      next: (response: any) => {
        this.ngToast.error({
          detail: 'Unable to initiate payment',
          summary: 'Plz try again later',
          duration: 5000,
        });
      },
      error: (error: HttpErrorResponse) => {
        // console.log(error.error.text);
        window.open(error.error.text, '_blank');
      },
    });
  }

  //Handle Error messages
  private handleError(msg: string, error: any) {
    this.ngToast.error({
      detail: msg,
      summary: error.error,
      duration: 5000,
    });
  }
}
