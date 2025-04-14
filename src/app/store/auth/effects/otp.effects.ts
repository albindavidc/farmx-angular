import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OtpActions } from '../actions/otp.actions';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { AuthActions } from '../actions/auth.actions';
import { Router } from '@angular/router';
import { OtpService } from '../services/otp.service';
import { VerifyOtpResponse } from '../../../shared/models/otp.model';

@Injectable()
export class OtpEffects {
  private actions$ = inject(Actions);
  private otpService = inject(OtpService);
  private router = inject(Router);

  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OtpActions.verifyOtp),
      tap(() => console.log('Verification otp initaiated')),
      mergeMap(({ request }) =>
        this.otpService.verifyOtp(request).pipe(
          tap((response) => console.log(`Otp service response ${response}`)),
          switchMap((response: VerifyOtpResponse) => {
            console.log('Dispatching success action', response, response.user);
            console.log('this is the user role', response.user);
            return [
              OtpActions.verifyOtpSuccess({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
              }),
              AuthActions.setAccessToken({ accessToken: response.accessToken }),
              AuthActions.setUser({
                id: response.user.id,
                email: response.user.email,
                name: response.user.name,
                password: '',
                phone: response.user.phone,
                role: response.user.role,
                isVerified: response.user.isVerified,
              }),
              AuthActions.navigateAfterAuth({
                role: response.user.role.toLowerCase(),
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

  navigateAfterAuth$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.navigateAfterAuth),
        tap(({ role }) => {
          console.log(`Navigating to this /${role}/home`);
          const navigationPath = `/${role}/home`;
          this.router.navigate([`${navigationPath}`]).then((success) => {
            console.error(`Failed to navigate to the home`);
          });
        })
      ),
    { dispatch: false }
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
