import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequestModel } from '../models/signup-request.model';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private readonly apiURL = `${environment.apiURL}/auth/signup`;
  constructor(private http: HttpClient) {}

  register(userDate: SignupRequestModel): Observable<{ tempUserId: string }> {
    return this.http.post<{ tempUserId: string }>(this.apiURL, userDate);
  }
}
