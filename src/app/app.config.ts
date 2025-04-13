import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { signupReducer } from './store/auth/reducers/signup.reducer';
import { OtpEffects } from './store/auth/effects/otp.effects';
import { SignupEffects } from './store/auth/effects/signup.effects';
import { otpReducer } from './store/auth/reducers/otp.reducer';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './core/auth/auth.interceptor';
import { authFeatureKey, authReducer } from './store/auth/reducers/auth.reducer';
import { LoginEffects } from './store/auth/effects/login.effects';
import { loginReducer } from './store/auth/reducers/login.reducer';
import { provideServerRendering } from '@angular/platform-server';
import {
  SvgIconRegistryService,
  SvgLoader,
  SvgHttpLoader,
} from 'angular-svg-icon';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStore(),

    SvgIconRegistryService,
    { provide: SvgLoader, useClass: SvgHttpLoader },

    provideEffects([SignupEffects, OtpEffects, LoginEffects]),
    provideState('signup', signupReducer),
    provideState('otp', otpReducer),
    provideState('auth', authReducer),
    provideState('login', loginReducer),
  ],
};
