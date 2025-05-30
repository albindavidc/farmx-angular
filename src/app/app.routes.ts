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
import { FarmerSettingsComponent } from './modules/farmer/farmer-settings/farmer-settings.component';
import { FarmerCommunityComponent } from './modules/farmer/farmer-community/farmer-community.component';
import { CreateCommunityComponent } from './shared/components/community/create-community/create-community.component';
import { AdminSettingsComponent } from './modules/admin/admin-settings/admin-settings.component';
import { AdminCommunityManagementComponent } from './modules/admin/admin-community-management/admin-community-management.component';
import { ForgotPasswordComponent } from './modules/auth/login/forgot-password/forgot-password.component';
import { AdminUserManagementComponent } from './modules/admin/admin-user-management/admin-user-management.component';

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
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'user',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['user'] },
    children: [
      { path: 'home', component: UserComponent },
      { path: 'settings', component: UserSettingsComponent },
    ],
  },

  {
    path: 'farmer',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['farmer'] },
    children: [
      { path: 'home', component: FarmerComponent },
      { path: 'settings', component: FarmerSettingsComponent },
      { path: 'community', component: FarmerCommunityComponent },
      { path: 'create-community', component: CreateCommunityComponent },
      { path: 'community/:id', component: FarmerCommunityComponent },
    ],
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    children: [
      { path: 'home', component: AdminComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: 'community', component: AdminCommunityManagementComponent },
      { path: 'create-community', component: CreateCommunityComponent },
      { path: 'community/:id', component: AdminCommunityManagementComponent },
      { path: 'user-management', component: AdminUserManagementComponent },
    ],
  },

  { path: '**', redirectTo: '/auth/login' },
];
