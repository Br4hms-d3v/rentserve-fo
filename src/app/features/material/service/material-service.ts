import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MaterialResponse } from '../model/Material';
import { map } from 'rxjs';
import { MaterialDetailModel } from '../model/material-detail';
import { MaterialForm } from '../model/material-form';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private apiUrl = environment.apiBaseUrl + environment.materialEndPoint; // API base URL + endPoint for materials
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

  getMaterials() {
    const headers = this.getAuthHeader();
    return this._http
      .get<MaterialResponse>(this.apiUrl + 'list', { headers })
      .pipe(map((response) => response._embedded.materialDTOList));
  }

  getMaterial(id: number) {
    const headers = this.getAuthHeader();
    return this._http.get<MaterialDetailModel>(this.apiUrl + id, { headers });
  }

  createMaterial(form: MaterialForm){
    const headers = this.getAuthHeader();
    return this._http.post<MaterialForm>(this.apiUrl + 'new', form, {headers});
  }

}
