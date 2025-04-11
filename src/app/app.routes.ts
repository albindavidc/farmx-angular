import { Routes } from '@angular/router';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { OtpVerificationComponent } from './modules/auth/otp-verification/otp-verification.component';
import { UserComponent } from './modules/user/user.component';
import { AdminComponent } from './modules/admin/admin.component';
import { FarmerComponent } from './modules/farmer/farmer.component';
import { LoginComponent } from './modules/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/signup', pathMatch: 'full' },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/otp-verification', component: OtpVerificationComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'user/home', component: UserComponent },
  { path: 'admin/dashboard', component: AdminComponent },
  { path: 'farmer/home', component: FarmerComponent },
];
