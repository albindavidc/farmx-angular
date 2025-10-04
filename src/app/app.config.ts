import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import {
  SvgHttpLoader,
  SvgIconRegistryService,
  SvgLoader,
} from 'angular-svg-icon';
import { routes } from './app.routes';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { authInterceptor } from './core/auth.interceptor';
import { ForgotPasswordEffects } from './store/auth/effects/forgot-password.effects';
import { LoginEffects } from './store/auth/effects/login.effects';
import { OtpEffects } from './store/auth/effects/otp.effects';
import { SignupEffects } from './store/auth/effects/signup.effects';
import { authReducer } from './store/auth/reducers/auth.reducer';
import { forgotPasswordReducer } from './store/auth/reducers/forgot-password.reducer';
import { loginReducer } from './store/auth/reducers/login.reducer';
import { otpReducer } from './store/auth/reducers/otp.reducer';
import { signupReducer } from './store/auth/reducers/signup.reducer';
import { CommunityEffects } from './store/community/community.effects';
import { communityReducer } from './store/community/community.reducer';
import { CommunityPostEffects } from './store/community/post/community-post.effects';
import { communityPostReducer } from './store/community/post/community-post.reducer';
import { metaReducers } from './store/meta-reducers';
import { SettingsEffects } from './store/settings/settings.effects';
import { settingsReducer } from './store/settings/settings.reducer';

const reducers = {
  auth: authReducer,
  login: loginReducer,
  signup: signupReducer,
  otp: otpReducer,
  forgotPassword: forgotPasswordReducer,

  settings: settingsReducer,
  community: communityReducer,
  communityPost: communityPostReducer,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStore(reducers, { metaReducers }),

    SvgIconRegistryService,
    { provide: SvgLoader, useClass: SvgHttpLoader },

    importProvidersFrom([
      MatTableModule,
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,

      MatIconModule,
      MatSelectModule,
      MatCheckboxModule,

      MatProgressSpinnerModule,
      MatSnackBarModule,

      MatSortModule,
      MatPaginatorModule,
    ]),

    provideEffects([
      SignupEffects,
      OtpEffects,
      LoginEffects,
      ForgotPasswordEffects,

      SettingsEffects,
      CommunityEffects,
      CommunityPostEffects,
    ]),

    provideState('signup', signupReducer),
    provideState('otp', otpReducer),
    provideState('auth', authReducer),
    provideState('login', loginReducer),
    provideState('forgotPassword', forgotPasswordReducer),

    provideState('settings', settingsReducer),
    provideState('community', communityReducer),
    provideState('communityPost', communityPostReducer),
  ],
};
