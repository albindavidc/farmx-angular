import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '../../shared/models/user/user.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly apiurl = `${environment.apiURL}`;
  constructor(private http: HttpClient) {}

  /* Profile Section */
  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(
      `${this.apiurl}/settings/update-profile`,
      updates,
      { withCredentials: true }
    );
  }

  /* Security Section */
  validateOldPassword(oldPassword: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiurl}/settings/validate-old-password`,
      { oldPassword },
      { withCredentials: true }
    );
  }

  changePassword(
    newPassword: string,
    confirmPassword: string
  ): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiurl}/settings/change-password`,
      { newPassword, confirmPassword },
      { withCredentials: true }
    );
  }

  forgotPasswordGenerateOtp(email: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiurl}/settings/send-otp`,
      { email },
      { withCredentials: true }
    );
  }

  forgotPasswordValidateOtp(
    email: string,
    otp: string
  ): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiurl}/settings/verify-otp`,
      { email, otp },
      { withCredentials: true }
    );
  }

  forgotPasswordResendOtp(email: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiurl}/settings/resend-otp`,
      { email },
      { withCredentials: true }
    );
  }
}
