import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { response } from 'express';

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  role: 'user' | 'farmer' | 'admin';
  isVerified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly apiUrl = `${environment.apiURL}`;

  constructor(private http: HttpClient) {}

  checkAuthStatus(): Observable<{
    isAuthenticated: boolean;
    user: TokenPayload | null;
  }> {
    return this.http
      .get<{ success: boolean; data: TokenPayload }>(`${this.apiUrl}/user`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => ({
          isAuthenticated: response.success,
          user: response.success ? response.data : null,
        })),
        catchError(() => of({ isAuthenticated: false, user: null }))
      );
  }

  refreshToken(): Observable<boolean> {
    return this.http
      .post<{ success: boolean }>(
        `${this.apiUrl}/auth/refresh`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response.success),
        catchError(() => of(false))
      );
  }

  logout(): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(map(() => void 0));
  }
}
