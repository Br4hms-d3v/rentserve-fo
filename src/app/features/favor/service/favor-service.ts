import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FavorResponse } from '../model/favor';
import { map } from 'rxjs';
import { FavorForm } from '../model/FavorForm';
import { FavorDetailModel } from '../model/favorlDetail';

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

  editFavor(id: number, form: FavorForm) {
    const headers = this.getAuthHeader();
    return this._http.put(this.apiUrl + 'edit/' + id, form, { headers });
  }

  getFavor(id: number) {
    const headers = this.getAuthHeader();
    return this._http.get<FavorDetailModel>(this.apiUrl + id, { headers });
  }

  createFavor(form: FavorForm) {
    const headers = this.getAuthHeader();
    return this._http.post<FavorForm>(this.apiUrl + 'new', form, { headers });
  }

  deleteFavor(id: number | undefined) {
    const headers = this.getAuthHeader();
    return this._http.delete(this.apiUrl + 'delete/' + id, { headers, responseType: 'text' });
  }

  getListFavourByNameOfCategory(nameOfCategory: string) {
    const headers = this.getAuthHeader();
    return this._http
      .get<FavorResponse>(this.apiUrl + 'category/' + nameOfCategory, { headers })
      .pipe(map((response: FavorResponse) => response._embedded.favorDTOList));
  }
}
