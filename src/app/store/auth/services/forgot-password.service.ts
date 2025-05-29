import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
  private readonly apiurl = `${environment.apiURL}`;
  constructor(private http: HttpClient) {}

  forgotPasswordGenerateOtp(email: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiurl}/auth/forgot-password/send-otp`,
      { email }
    );
  }

  forgotPasswordResendOtp(email: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiurl}/auth/forgot-password/resend-otp`,
      { email }
    );
  }

  forgotPasswordValidateOtp(
    email: string,
    otp: string
  ): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiurl}/auth/forgot-password/verify-otp`,
      { email, otp }
    );
  }

  changePassword(
    email: string,
    newPassword: string,
    confirmPassword: string,
  ): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiurl}/auth/forgot-password/change-password`,
      {email, newPassword, confirmPassword }
    );
  }
}
