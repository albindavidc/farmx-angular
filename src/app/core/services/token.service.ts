import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';

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
      .get<{ success: boolean; data: TokenPayload }>(`${this.apiUrl}/auth/user`, {
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
      .post<{ success: boolean; accessToken?: string }>(
        `${this.apiUrl}/auth/refresh-access-token`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response.success),
        catchError((error) => {
          console.error(`Refresh token failed: ${error}`);
          return of(false);
        })
      );
  }

  logout(): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(map(() => void 0));
  }
}
