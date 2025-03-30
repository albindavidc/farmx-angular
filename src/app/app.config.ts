import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

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
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    provideHttpClient(withFetch()),
    provideStore(),
    provideEffects([SignupEffects, OtpEffects]),
    provideState('signup', signupReducer),
    provideState('otp', otpReducer),
  ],
};
