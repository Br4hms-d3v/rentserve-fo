import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserModel } from '../model/user-model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegistrationModel } from '../model/registration';
import { LoginModel } from '../model/login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = environment.apiBaseUrl + environment.authEndPoint;

  private readonly _currentUser = new BehaviorSubject<UserModel | null>(this.getInitialUser());

  readonly currentUser$ = this._currentUser.asObservable();

  private getInitialUser(): UserModel | null {
    const potentialUser = localStorage.getItem('currentUser');

    if (!potentialUser) {
      return null;
    }

    try {
      return JSON.parse(potentialUser);
    } catch {
      localStorage.removeItem('currentUser');
      return null;
    }
  }

  /**
   * Registration from customer
   * @param form return a form registered with data from user
   */
  register(form: RegistrationModel): Observable<UserModel> {
    return this._http.post<UserModel>(this.apiUrl + 'register', form, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  login(form: LoginModel): Observable<UserModel> {
    return this._http
      .post<UserModel>(this.apiUrl + 'login', form, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json', // Send as JSON
        }),
        withCredentials: true, // Send Cookies
      })
      .pipe(
        tap((data) => {
          this._currentUser.next(data);
          localStorage.setItem('currentUser', JSON.stringify(data));
          localStorage.setItem('token', data.token);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');

    this._currentUser.next(null);
  }

}
