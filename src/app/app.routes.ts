import { Routes } from '@angular/router';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { OtpVerificationComponent } from './modules/auth/otp-verification/otp-verification.component';
import { UserComponent } from './modules/user/user.component';
import { AdminComponent } from './modules/admin/admin.component';
import { FarmerComponent } from './modules/farmer/farmer.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { UserSettingsComponent } from './modules/user/user-settings/user-settings.component';
import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/signup', pathMatch: 'full' },
  { path: 'auth/signup', component: SignupComponent, canActivate: [authGuard] },
  {
    path: 'auth/otp-verification',
    component: OtpVerificationComponent,
    canActivate: [authGuard],
  },
  { path: 'auth/login', component: LoginComponent, canActivate: [authGuard] },
  {
    path: 'user',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['user', 'farmer', 'admin'] },
    children: [
      { path: 'home', component: UserComponent },
      { path: 'settings', component: UserSettingsComponent },
    ],
  },

  {
    path: 'farmer',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['farmer'] },
    children: [{ path: 'home', component: FarmerComponent }],
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [{ path: 'home', component: AdminComponent }],
  },

  { path: '**', redirectTo: '/auth/login' },
];
