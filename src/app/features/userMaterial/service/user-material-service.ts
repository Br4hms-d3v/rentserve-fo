import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { UserMaterialResponse } from '../model/userMaterial';
import { map } from 'rxjs';
import { UserMaterialDetailModel } from '../model/user-material-detail';

@Injectable({
  providedIn: 'root',
})
export class UserMaterialService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl + environment.userMaterialEndPoint; // API base URL + endPoint for user material

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

  getUserMaterialByUser(id: number) {
    const headers = this.getAuthHeader();
    return this._http
      .get<UserMaterialResponse>(this.apiUrl + 'user/' + id, { headers })
      .pipe(map((response) => response._embedded.userMaterialDTOList));
  }

  getUserMaterialDetail(id: number) {
    const headers = this.getAuthHeader();
    return this._http.get<UserMaterialDetailModel>(this.apiUrl + id, { headers });
  }
}
