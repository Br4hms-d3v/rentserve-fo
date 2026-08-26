import { Injectable } from '@angular/core';
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
  private apiUrl = environment.apiBaseUrl + environment.authEndPoint; // API base URM + endPoint for auth
  _currentUser!: BehaviorSubject<UserModel | null>; //Save the current ser (as an observable)

  constructor(private readonly _http: HttpClient) {
    let potentialUser = localStorage.getItem('currentUser'); // Try to read user form localStorage
    this._currentUser = new BehaviorSubject<UserModel | null>(
      // If user exists set it, if not, use null
      potentialUser ? JSON.parse(potentialUser) : null,
    );
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
        }
        ));
  }
}
