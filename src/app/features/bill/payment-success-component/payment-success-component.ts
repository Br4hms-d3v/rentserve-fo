import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from '../service/bill-service';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-payment-success-component',
  imports: [TuiButton],
  templateUrl: './payment-success-component.html',
  styleUrl: './payment-success-component.less',
})
export class PaymentSuccessComponent {
  private _billService = inject(BillService); // Call the service to bill
  private _stripeService = inject(BillService);
  private readonly _router =inject(Router); // Tool to navigate

  sessionId: string | null = null;
  billId: string | null = null;
  loading = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id')?.trim() ?? '';
    this.billId = this.route.snapshot.queryParamMap.get('billId');

    console.log('Stripe session ID :', this.sessionId);
    console.log('Bill ID :', this.billId);

    if (this.sessionId) {
      this._stripeService.confirmedPayment(this.sessionId).subscribe({
        next: (response) => {
          // console.log('Paiement confirmé :', response);
        },
        error: (error) => {
          // console.error('Erreur de confirmation :', error);
          // console.error('Détail du backend :', error.error);
        },
      });
    }
  }

  downloadBill(): void {
    const id = Number(this.billId);

    if (!this.billId || !Number.isFinite(id) || id <= 0) {
      console.error('Identifiant de facture introuvable');
      return;
    }

    this.loading = true;

    this._billService.getBillPdf(id).subscribe({
      next: (pdf: Blob) => {
        const url = window.URL.createObjectURL(pdf);
        const link = document.createElement('a');

        link.href = url;
        link.download = `facture-${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.URL.revokeObjectURL(url);
        this.loading = false;

        setTimeout(() =>{
          this._router.navigate(['/dashboard']);
        },3000)
      },
      error: (error) => {
        console.error('Erreur lors du téléchargement de la facture :', error);
        this.loading = false;
      },
    });
  }

  onBack(){
    this._router.navigate(['/dashboard']);
  };
}
