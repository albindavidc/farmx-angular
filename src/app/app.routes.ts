import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AdminCommunityManagementComponent } from './modules/admin/admin-community-management/admin-community-management.component';
import { AdminSettingsComponent } from './modules/admin/admin-settings/admin-settings.component';
import { AdminUserManagementComponent } from './modules/admin/admin-user-management/admin-user-management.component';
import { AdminComponent } from './modules/admin/admin.component';
import { ForgotPasswordComponent } from './modules/auth/login/forgot-password/forgot-password.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { OtpVerificationComponent } from './modules/auth/otp-verification/otp-verification.component';
import { SignupComponent } from './modules/auth/signup/signup.component';
import { FarmerCommunityComponent } from './modules/farmer/farmer-community/farmer-community.component';
import { FarmerSettingsComponent } from './modules/farmer/farmer-settings/farmer-settings.component';
import { FarmerComponent } from './modules/farmer/farmer.component';
import { UserCommunityComponent } from './modules/user/user-community/user-community.component';
import { UserSettingsComponent } from './modules/user/user-settings/user-settings.component';
import { UserComponent } from './modules/user/user.component';
import { CreateCommunityComponent } from './shared/components/community/create-community/create-community.component';

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
      { path: 'community', component: UserCommunityComponent },
      { path: 'community/:id', component: UserCommunityComponent },
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
