import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OtpService } from '../services/otp.service';
import { OtpActions } from '../actions/otp.actions';
import {
  catchError,
  map,
  mergeMap,
  Observable,
  of,
  retry,
  switchMap,
  tap,
} from 'rxjs';
import { response } from 'express';
import { AuthActions } from '../actions/auth.actions';
import { error } from 'console';
import { VerifyOtpResponse } from '../models/otp.model';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Injectable()
export class OtpEffects {
  private actions$ = inject(Actions);
  private otpService = inject(OtpService);
  private router = inject(Router);
  private store = inject(Store);

  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OtpActions.verifyOtp),
      mergeMap(({ request }) =>
        this.otpService.verifyOtp(request).pipe(
          switchMap((response: VerifyOtpResponse) => {
            this.router.navigate([`/${response.user.role.toLowerCase()}`]);
            return [
              OtpActions.verifyOtpSuccess({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
              }),
              AuthActions.setAccessToken({ accessToken: response.accessToken }),
              AuthActions.setUser({
                id: response.user.id,
                email: response.user.id,
                name: response.user.name,
                password: '',
                phone: response.user.phone,
                role: response.user.role,
                isVerified: response.user.isVerified,
              }),
            ];
          }),

          // Handling errors with `catchError`
          catchError((error) =>
            of(
              OtpActions.verifyOtpFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  resendOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OtpActions.resendOtp),
      mergeMap(({ request }) =>
        this.otpService.resendOtp(request).pipe(
          map(() => OtpActions.resendOtpSuccess()),
          catchError((error) =>
            of(OtpActions.resendOtpFailure({ error: error.message }))
          )
        )
      )
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      mergeMap(() =>
        this.otpService.refreshToken().pipe(
          map((response) =>
            AuthActions.refreshTokenSuccess({
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
            })
          ),
          catchError((error) =>
            of(AuthActions.refreshTokenFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
