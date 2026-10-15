import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { RentalService } from '../service/rental-service';
import { AuthService } from '../../auth/service/auth-service';
import { NgClass } from '@angular/common';
import { TuiButton } from '@taiga-ui/core';
import { BillService } from '../../bill/service/bill-service';

@Component({
  selector: 'app-rental-not-paid',
  imports: [TuiTable, NgClass, TuiButton],
  templateUrl: './rental-not-paid.html',
  styleUrl: './rental-not-paid.less',
})
export class RentalNotPaid implements OnInit {
  private _rentalService = inject(RentalService); // Call the service to display list rental not paid
  private _authService = inject(AuthService); // call the service auth to display user identifier
  private _stripe = inject(BillService); // Call the service to pay
  private _cdr = inject(ChangeDetectorRef);

  isDarkMode = false; // Get a false for change theme
  userId!: number;
  rentalsNotPaid: any[] = [];
  billId!: number;

  ngOnInit() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });

    this.rentalNotPaidList();
  }

  protected rentalNotPaidList(): void {
    this._rentalService.rentalNotPaid(this.userId).subscribe({
      next: (rental) => {
        // console.log(rental);
        this.rentalsNotPaid = rental;

        rental.forEach((rental) => {
          this.billId = rental.billId;
        });

        this._cdr.detectChanges();
      },
    });
  }

  protected onPay() {
    this._stripe.payStripe(this.billId).subscribe({
      next: (payment) => {
        // console.log(payment);

        if (payment.checkoutUrl) {
          window.location.href = payment.checkoutUrl;
        } else {
          console.error('URL de paiement Stripe introuvable');
        }
      },
      error: (error) => {
        console.error('Erreur lors du paiement :', error);
      },
    });
  }

  protected onEditRental(){

  };

  protected onDeleteRental(){

  }
}
