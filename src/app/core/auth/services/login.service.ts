import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { User } from '../models/auth-state.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly apiUrl = `${environment.apiURL}/auth`;
  constructor(private http: HttpClient) {}

  login(payload: {
    email: string;
    password: string;
  }): Observable<{ user: User; accessToken: string; refreshToken: string }> {
    return this.http.post<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>(`${this.apiUrl}/login`, payload);
  }
}
