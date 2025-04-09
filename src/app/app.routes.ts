import { Routes } from '@angular/router';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { OtpVerificationComponent } from './modules/auth/otp-verification/otp-verification.component';

export const routes: Routes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/otp-verification', component: OtpVerificationComponent },
];
