import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import {
  ResendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from '../../../shared/models/otp.model';
import { TokenService } from '../../../core/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private readonly apiURL = `${environment.apiURL}/auth`;
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  sendOtp(email: string): Observable<SendOtpResponse> {
    return this.http.post<SendOtpResponse>(`${this.apiURL}/send-otp`, {
      email,
    });
  }

  verifyOtp(request: VerifyOtpRequest): Observable<VerifyOtpResponse> {
    return this.http.post<VerifyOtpResponse>(
      `${this.apiURL}/verify-otp`,
      request
    );
  }

  resendOtp(request: ResendOtpRequest): Observable<void> {
    return this.http.post<void>(`${this.apiURL}/resend-otp`, request);
  }

  refreshToken(refreshToken: string): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.apiURL}/refresh-token`,
      { refreshToken }
      // { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiURL}/logout`, {})
      .pipe(tap(() => this.tokenService.clearToken()));
  }
}
