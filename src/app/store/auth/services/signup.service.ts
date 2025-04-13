import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequestModel, SignupResponseModel } from '../../../shared/models/signup.model';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly apiURL = `${environment.apiURL}/auth`;
  constructor(private http: HttpClient) {}

  signup(userData: SignupRequestModel): Observable<SignupResponseModel> {
    return this.http.post<SignupResponseModel>(`${this.apiURL}/signup`, userData);
  }
}
