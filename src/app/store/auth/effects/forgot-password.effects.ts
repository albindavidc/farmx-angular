import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { ForgotPasswordService } from '../services/forgot-password.service';
import { ForgotPasswordActions } from '../actions/forgot-password.actions';

@Injectable()
export class ForgotPasswordEffects {
  forgotPasswordService = inject(ForgotPasswordService);

  constructor(private actions$: Actions) {}

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ForgotPasswordActions.changePassword),
      exhaustMap((action) =>
        this.forgotPasswordService
          .changePassword(action.email, action.newPassword, action.confirmPassword)
          .pipe(
            map((response) =>
              response.success
                ? ForgotPasswordActions.changePasswordSuccess({
                    success: response.success,
                  })
                : ForgotPasswordActions.changePasswordFailure({
                    error: 'Password Not Changed',
                  })
            ),
            catchError((error) =>
              of(
                ForgotPasswordActions.changePasswordFailure({
                  error: error.message,
                })
              )
            )
          )
      )
    )
  );

  forgotPasswordGenerateOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ForgotPasswordActions.forgotPasswordGenerateOtp),
      exhaustMap((action) =>
        this.forgotPasswordService.forgotPasswordGenerateOtp(action.email).pipe(
          map((response) => {
            console.log('this is from the front-end effects', response, response.success)
            if (response.success) {
              return ForgotPasswordActions.forgotPasswordGenerateOtpSuccess({
                success: response.success,
              });
            }

            return ForgotPasswordActions.forgotPasswordGenerateOtpFailure({
              error: 'Otp Generation failed',
            });
          }),
          catchError((error) =>
            of(
              ForgotPasswordActions.forgotPasswordGenerateOtpFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  forgotPasswordValidateOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ForgotPasswordActions.forgotPasswordValidateOtp),
      exhaustMap((action) =>
        this.forgotPasswordService
          .forgotPasswordValidateOtp(action.email, action.otp)
          .pipe(
            map((response) => {
              if (response.success) {
                return ForgotPasswordActions.forgotPasswordValidateOtpSuccess({
                  success: response.success,
                });
              }
              return ForgotPasswordActions.forgotPasswordValidateOtpFailure({
                error: 'Otp Validation Failed',
              });
            }),
            catchError((error) =>
              of(
                ForgotPasswordActions.forgotPasswordValidateOtpFailure({
                  error: error.message,
                })
              )
            )
          )
      )
    )
  );

  forgotPasswordResendOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ForgotPasswordActions.forgotPasswordResendOtp),
      exhaustMap((action) =>
        this.forgotPasswordService.forgotPasswordResendOtp(action.email).pipe(
          map((response) => {
            if (response.success) {
              return ForgotPasswordActions.forgotPasswordResendOtpSuccess({
                success: response.success,
              });
            }

            return ForgotPasswordActions.forgotPasswordResendOtpFailure({
              error: 'Resend otp failed',
            });
          }),
          catchError((error) =>
            of(
              ForgotPasswordActions.forgotPasswordResendOtpFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );
}
