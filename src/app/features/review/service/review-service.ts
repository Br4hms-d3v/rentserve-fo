import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { ReviewUserMaterialResponse } from '../model/reviewUserMaterial';
import { map } from 'rxjs';
import { ReviewCreateUserMaterialForm } from '../model/review-create-userMaterial-form';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly _http = inject(HttpClient);
  private readonly apiUrl = environment.apiBaseUrl + environment.reviewEndPoint; // API base URL + endPoint for review

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

  getReviewUserMaterial(id: number) {
    const headers = this.getAuthHeader();
    return this._http
      .get<ReviewUserMaterialResponse>(this.apiUrl + 'user-material/' + id, { headers, })
      .pipe(map((response) => response._embedded.reviewUserMaterialDTOList));
  }

  createNewReviewUserMaterial(form: ReviewCreateUserMaterialForm ) {
    const headers = this.getAuthHeader();
    return this._http.post<ReviewCreateUserMaterialForm>(this.apiUrl + 'material', form, { headers });
  }

  deleteReviewUserMaterial(id: number) {
    const headers = this.getAuthHeader();
    return this._http.delete(this.apiUrl + 'delete/' +id, { headers, responseType: 'text' });
  }
}
