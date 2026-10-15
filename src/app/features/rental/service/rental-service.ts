import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RentalCreateForm } from '../model/rentalCreateForm';
import { map } from 'rxjs';
import { RentalNotPaidResponse } from '../model/rentalNotPaid';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  private apiUrl = environment.apiBaseUrl + environment.rentalEndPoint; // API base URL + endPoint for rental
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

  rentalCreate(id: number, form: RentalCreateForm) {
    const headers = this.getAuthHeader();
    return this._http.post<RentalCreateForm>(this.apiUrl + 'new-rental/' + id, form, { headers });
  }

  rentalNotPaid(id: number) {
    const headers = this.getAuthHeader();
    return this._http
      .get<RentalNotPaidResponse>(this.apiUrl + 'user/' + id, { headers })
      .pipe(map((response) => response._embedded.rentalByIdDTOList));
  }
}
