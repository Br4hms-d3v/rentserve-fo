import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { UserModel } from '../../features/auth/model/user-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `{environment.apiBaseUrl}${environment.authEndPoint}`;
  private readonly initialUser: UserModel | null = (() => {
    const potentialUser = localStorage.getItem('currentUser');
    return potentialUser ? JSON.parse(potentialUser) : null;
  })();

  private readonly _currentUser = new BehaviorSubject<UserModel | null>(this.initialUser);

  readonly currentUser$: Observable<UserModel | null> = this._currentUser.asObservable();

  getCurrentUserId(): number | null {
    return this._currentUser.getValue()?.id ?? null;
  }

}
