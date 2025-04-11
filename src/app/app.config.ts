import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { signupReducer } from './core/auth/reducers/signup.reducer';
import { OtpEffects } from './core/auth/effects/otp.effects';
import { SignupEffects } from './core/auth/effects/signup.effects';
import { otpReducer } from './core/auth/reducers/otp.reducer';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { authInterceptor } from './core/auth/auth.interceptor';
import { authFeatureKey, authReducer } from './core/auth/reducers/auth.reducer';
import { LoginEffects } from './core/auth/effects/login.effects';
import { loginReducer } from './core/auth/reducers/login.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(withEventReplay()),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideStore(),

    provideEffects([SignupEffects, OtpEffects, LoginEffects]),
    provideState('signup', signupReducer),
    provideState('otp', otpReducer),
    provideState('auth', authReducer),
    provideState('login', loginReducer),
  ],
};
