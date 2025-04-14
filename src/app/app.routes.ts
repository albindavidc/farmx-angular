import { Routes } from '@angular/router';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { OtpVerificationComponent } from './modules/auth/otp-verification/otp-verification.component';
import { UserComponent } from './modules/user/user.component';
import { AdminComponent } from './modules/admin/admin.component';
import { FarmerComponent } from './modules/farmer/farmer.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { NavBarComponent } from './shared/components/nav-bar/nav-bar.component';
import { UserNavBarComponent } from './shared/components/nav-bar/user-nav-bar/user-nav-bar.component';
import { UserSettingsComponent } from './modules/user/user-settings/user-settings.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/signup', pathMatch: 'full' },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/otp-verification', component: OtpVerificationComponent },
  { path: 'auth/login', component: LoginComponent },
  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      { path: 'home', component: UserComponent },
      { path: 'settings', component: UserSettingsComponent },
    ],
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [{ path: 'dashboard', component: AdminComponent }],
  },
  {
    path: 'farmer',
    canActivate: [authGuard],
    children: [{ path: 'home', component: FarmerComponent }],
  },

  { path: '**', redirectTo: '/auth/login' },
];
