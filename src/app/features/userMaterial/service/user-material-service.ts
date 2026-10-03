import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { UserMaterialResponse } from '../model/userMaterial';
import { map } from 'rxjs';
import { UserMaterialDetailModel } from '../model/user-material-detail';
import { UserMaterialEditForm } from '../model/user-material-edit-form';
import { UserMaterialCreateForm } from '../model/user-material-create-form';

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

  private getAuthorizationHeader() {
    const userJson = localStorage.getItem('currentUser');
    let token = '';

    if (userJson) {
      const user = JSON.parse(userJson);
      token = user.token;
    }

    return new HttpHeaders({
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
    return this._http.get<UserMaterialDetailModel>(this.apiUrl + 'my-material/' + id, { headers });
  }

  deleteUserMaterial(id: number) {
    const headers = this.getAuthHeader();
    return this._http.delete(this.apiUrl + id + '/delete', { headers, responseType: 'text' });
  }

  editUserMaterial(id: number, form: UserMaterialEditForm) {
    const headers = this.getAuthHeader();
    return this._http.put<UserMaterialEditForm>(this.apiUrl + id + '/edit', form, { headers });
  }

  createUserMaterial(form: UserMaterialCreateForm, pictures: File[]) {
    const headers = this.getAuthorizationHeader();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    pictures.forEach((picture) => formData.append('pictures', picture, picture.name));
    return this._http.post<UserMaterialCreateForm>(this.apiUrl + 'new', formData, { headers });
  }

  getUserMaterialByMaterial(nameMaterial: string) {
    const headers = this.getAuthHeader();
    return this._http
      .get<UserMaterialResponse>(this.apiUrl + 'list/' + nameMaterial, { headers })
      .pipe(map((response) => response._embedded.userMaterialDTOList));
  }
}
