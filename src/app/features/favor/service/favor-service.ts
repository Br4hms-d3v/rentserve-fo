import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FavorResponse } from '../model/favor';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavorService {
  private apiUrl = environment.apiBaseUrl + environment.favorEndPoint; // API base URL + endPoint for favor
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

  getFavour() {
    const headers = this.getAuthHeader();
    return this._http
      .get<FavorResponse>(this.apiUrl + 'list', { headers })
      .pipe(map((response) => response._embedded.favorDTOList));
  }
}
