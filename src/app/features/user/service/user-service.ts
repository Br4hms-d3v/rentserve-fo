import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { UserModel } from '../model/user';
import { UserForm } from '../model/userForm';
import { UserTokenModel } from '../model/userToken';
import { tap } from 'rxjs';

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

  editUser(id: number, form: UserForm) {
    const headers = this.getAuthHeader();
    return this._http.put<UserTokenModel>(this.apiUrl + id + '/edit', form, { headers }).pipe(
      tap((response) => {
        this.updateLocalStoredToken(response);
      }),
    );
  }

  private updateLocalStoredToken(response: UserTokenModel) {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return;

    const currentUser = JSON.parse(userJson);

    // On fusionne les nouvelles infos (pseudo, email, etc.) et surtout le nouveau token
    const updatedUser = {
      ...currentUser,
      ...response,
      token: response.token,
    };

    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }
}
