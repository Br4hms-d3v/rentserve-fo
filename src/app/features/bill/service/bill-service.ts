import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StripeModel } from '../model/stripeModel';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  private apiUrl = environment.apiBaseUrl + environment.stripEndPoint; // API base URL + endPoint for stripe
  private apiUrlBill = environment.apiBaseUrl + environment.billEndPoint; // API base URL + endPoint for bill
  private readonly _http = inject(HttpClient);

  private getAuthHeader() {
    const userJson = localStorage.getItem('currentUser');
    let token = '';

    if (userJson) {
      const user = JSON.parse(userJson);
      token = user.token;
    }

    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  payStripe(id: number) {
    const headers = this.getAuthHeader();
    return this._http.post<StripeModel>(this.apiUrl + id + '/pay', { headers });
  }

  getBillPdf(id: number) {
    const headers = this.getAuthHeader();
    return this._http.get(this.apiUrlBill + id + '/pdf', {
      headers: headers,
      responseType: 'blob',
    });
  }

  confirmedPayment(sessionId: string) {
    const headers = this.getAuthHeader();

    return this._http.get(this.apiUrl + 'payment/confirmed', {
      headers: headers,
      params: { sessionId: sessionId },
      responseType: 'text',
    });
  }
}
