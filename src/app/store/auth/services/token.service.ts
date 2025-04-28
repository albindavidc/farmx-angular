import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { UserRole } from '../../../shared/models/user-role';

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  password: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly apiUrl = `${environment.apiURL}`;

  constructor(private http: HttpClient) {}

  checkAuthStatus(): Observable<{
    data: TokenPayload | null;
  }> {
    return this.http
      .get<{ data: TokenPayload | null }>(`${this.apiUrl}/auth/user`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => ({
          data: response ? response.data : null,
        })),
        catchError(() => of({ data: null }))
      );
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(
        `${this.apiUrl}/auth/refresh-access-token`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          console.error(`Refresh token failed: ${error}`);
          return of({ accessToken: '' });
        })
      );
  }

  logout(): Observable<void> {
    return this.http
      .post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .pipe(map(() => void 0));
  }
}
