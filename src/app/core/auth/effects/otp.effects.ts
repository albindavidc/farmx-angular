import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OtpService } from '../services/otp.service';
import { OtpActions } from '../actions/otp.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { response } from 'express';
import { AuthActions } from '../actions/auth.actions';
import { error } from 'console';

@Injectable()
export class OtpEffects {
  private actions$ = inject(Actions);
  private otpService = inject(OtpService);

  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OtpActions.verifyOtp),
      mergeMap(({ request }) =>
        this.otpService.verifyOtp(request).pipe(
          switchMap((response) =>
            of(
              OtpActions.verifyOtpSuccess({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
              })
            )
          ),
          catchError((error) =>
            of(OtpActions.verifyOtpFailure({ error: error.message }))
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
