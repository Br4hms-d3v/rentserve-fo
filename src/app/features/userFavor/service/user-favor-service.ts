import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { map } from 'rxjs';
import { UserFavorResponse } from '../model/userFavor';
import { UserFavorDetailModel } from '../model/user-favor-detail';
import { UserFavorEditForm } from '../model/user-favor-edit-form';

@Injectable({
  providedIn: 'root',
})
export class UserFavorService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl + environment.userFavorEndPoint;

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

  getUserFavorByUser(id: number) {
    const headers = this.getAuthHeader();
    return this._http
      .get<UserFavorResponse>(this.apiUrl + 'user/' + id, { headers })
      .pipe(map((response) => response._embedded.userFavorDTOList));
  }

  getUserFavorDetail(id: number) {
    const headers = this.getAuthHeader();
    return this._http.get<UserFavorDetailModel>(this.apiUrl + 'my-favor/' + id, { headers });
  }

  deleteUserFavor(id: number) {
    const headers = this.getAuthHeader();
    return this._http.delete(this.apiUrl + id + '/delete', { headers });
  }

  editUserFavor(id: number, form: UserFavorEditForm) {
    const headers = this.getAuthHeader();
    return this._http.put<UserFavorEditForm>(this.apiUrl + id + '/edit', form, { headers });
  }
}
