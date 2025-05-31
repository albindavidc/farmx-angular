import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  SvgIconRegistryService,
  SvgLoader,
  SvgHttpLoader,
} from 'angular-svg-icon';

import { authInterceptor } from './core/auth/auth.interceptor';
import { SignupEffects } from './store/auth/effects/signup.effects';
import { signupReducer } from './store/auth/reducers/signup.reducer';
import { OtpEffects } from './store/auth/effects/otp.effects';
import { otpReducer } from './store/auth/reducers/otp.reducer';
import { authReducer } from './store/auth/reducers/auth.reducer';
import { LoginEffects } from './store/auth/effects/login.effects';
import { loginReducer } from './store/auth/reducers/login.reducer';
import { SettingsEffects } from './store/settings/settings.effects';
import { settingsReducer } from './store/settings/settings.reducer';
import { CommunityEffects } from './store/community/community.effects';
import { communityReducer } from './store/community/community.reducer';
import { CommunityPostEffects } from './store/community/post/community-post.effects';
import { communityPostReducer } from './store/community/post/community-post.reducer';
import { ForgotPasswordEffects } from './store/auth/effects/forgot-password.effects';
import { forgotPasswordReducer } from './store/auth/reducers/forgot-password.reducer';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStore(),

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
