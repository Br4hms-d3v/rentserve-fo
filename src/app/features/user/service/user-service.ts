import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { UserModel } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl + environment.userEndPoint; // API base URL + endPoint for user

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

  getUser(id: number) {
    const headers = this.getAuthHeader();
    return this._http.get<UserModel>(this.apiUrl + id, { headers });
  }
}
