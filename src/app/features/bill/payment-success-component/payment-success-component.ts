import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from '../service/bill-service';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../../core/services/ThemeService';

@Component({
  selector: 'app-payment-success-component',
  imports: [TuiButton, TuiIcon],
  templateUrl: './payment-success-component.html',
  styleUrl: './payment-success-component.less',
})
export class PaymentSuccessComponent {
  private _billService = inject(BillService); // Call the service to bill
  private readonly _router = inject(Router); // Tool to navigate
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);
  private readonly themeService = inject(ThemeService);

  isDarkMode = false;
  sessionId: string | null = null;
  billId: string | null = null;
  loading = false;

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id')?.trim() || null;

    this.billId = this.route.snapshot.queryParamMap.get('billId');

    // Synchronisation du thème
    this.changeTheme();

    // Confirmation du paiement
    if (this.sessionId) {
      this._billService
        .confirmedPayment(this.sessionId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            console.log('Paiement confirmé.');
          },
          error: (error) => {
            console.error('Erreur lors de la confirmation du paiement :', error);
          },
        });
    }
  }

  protected downloadBill(): void {
    const id = Number(this.billId);

    if (!this.billId || !Number.isSafeInteger(id) || id <= 0 || this.loading) {
      return;
    }

    this.loading = true;

    this._billService
      .getBillPdf(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (pdf: Blob) => {
          const url = window.URL.createObjectURL(pdf);
          const link = document.createElement('a');

          link.href = url;
          link.download = `facture-${id}.pdf`;

          document.body.appendChild(link);
          link.click();
          link.remove();

          // Libération différée de l'URL
          window.setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);

          this.loading = false;
        },

        error: (error) => {
          console.error('Erreur lors du téléchargement de la facture :', error);

          this.loading = false;
        },
      });
  }

  onBack(): void {
    this._router.navigate(['/dashboard']);
  }

  changeTheme() {
    this.themeService.darkMode$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((mode: boolean) => {
        this.isDarkMode = mode;
      });
  }
}
