import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import {
  ResendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
} from '../models/otp.model';
import { Observable } from 'rxjs';

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

  verifyOtp(request: VerifyOtpRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiURL}/verify`, request);
  }

  resendOtp(request: ResendOtpRequest): Observable<void> {
    return this.http.post<void>(`${this.apiURL}/resend`, request);
  }
}
