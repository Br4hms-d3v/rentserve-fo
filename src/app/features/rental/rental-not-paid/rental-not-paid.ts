import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { RentalService } from '../service/rental-service';
import { AuthService } from '../../auth/service/auth-service';
import { DecimalPipe } from '@angular/common';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { BillService } from '../../bill/service/bill-service';
import { ThemeService } from '../../../core/services/ThemeService';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-rental-not-paid',
  imports: [TuiTable, TuiButton, DecimalPipe, TuiIcon],
  templateUrl: './rental-not-paid.html',
  styleUrl: './rental-not-paid.less',
})
export class RentalNotPaid implements OnInit {
  private _rentalService = inject(RentalService); // Call the service to display list rental not paid
  private _authService = inject(AuthService); // call the service auth to display user identifier
  private readonly themeService = inject(ThemeService); // Change theme
  private _stripe = inject(BillService); // Call the service to pay
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  protected isDarkMode = false; // Get a false for change theme
  userId!: number;
  rentalsNotPaid: any[] = [];
  billId!: number;

  ngOnInit() {
    this._authService.currentUser$.subscribe((user) => {
      if (user) {
        this.userId = user.id;
      }
    });

    this.isDarkMode = this.themeService.isDarkMode();

    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
        this._cdr.markForCheck();
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

  protected get totalAmount(): number {
    return this.rentalsNotPaid.reduce((total, rental) => total + Number(rental.amount ?? 0), 0);
  }

  protected onEditRental(rental: any) {
    console.log(rental);
  }

  protected onDeleteRental(rental: any) {
    console.log(rental);
  }
}
