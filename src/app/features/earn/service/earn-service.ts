import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { EarnThisMonthModel } from '../model/earnThisMonth';

@Injectable({
  providedIn: 'root',
})
export class EarnService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl + environment.earnEndPoint; // API base URL + endPoint for user earn

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

  getEarnThisMonth(id: number){
    const headers = this.getAuthHeader();
    return this._http.get<EarnThisMonthModel>(this.apiUrl + 'my-earned-this-month/' + id, { headers });
  }
}
