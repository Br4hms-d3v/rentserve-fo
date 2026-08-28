import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CategoryModel, CategoryResponse } from '../model/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = environment.apiBaseUrl + environment.categoryEndPoint; // API base URL + endPoint for categories

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

  constructor(private readonly _http: HttpClient) {}

  getCategoriesMaterial(): Observable<CategoryModel[]> {
    const headers = this.getAuthHeader();

    return this._http
      .get<CategoryResponse>(this.apiUrl + 'material', { headers })
      .pipe(map((response) => response._embedded.categoryDTOList));
  }

  getCategoriesFavor(): Observable<CategoryModel[]> {
    const headers = this.getAuthHeader();

    return this._http
      .get<CategoryResponse>(this.apiUrl + 'favor', { headers })
      .pipe(map((response) => response._embedded.categoryDTOList));
  }
}
