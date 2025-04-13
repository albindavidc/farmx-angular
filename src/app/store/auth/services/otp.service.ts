import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ResendOtpRequest, SendOtpResponse, VerifyOtpRequest, VerifyOtpResponse } from '../../../shared/models/otp.model';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private readonly apiURL = `${environment.apiURL}/auth`;
  constructor(private http: HttpClient) {}

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

  refreshToken(): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh-token',
      {},
      { withCredentials: true }
    );
  }
}
