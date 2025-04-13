import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { SignupActions } from '../actions/signup.actions';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { OtpService } from '../services/otp.service';

@Injectable()
export class SignupEffects {
  private actions$ = inject(Actions);
  private signupService = inject(SignupService);
  private otpService = inject(OtpService);
  private router = inject(Router);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignupActions.signup),
      mergeMap(({ userData }) =>
        this.signupService.signup(userData).pipe(
          switchMap((response) => {
            console.log(response);
            if (response.success && response.data) {
              console.log(response.data);
              console.log(userData.email);
              return this.otpService.sendOtp(userData.email).pipe(
                switchMap(() => [
                  SignupActions.signupSuccess({ tempUser: response.data }),
                ]),
                tap(() => {
                  this.router.navigate(['/auth/otp-verification'], {
                    queryParams: { email: userData.email },
                  });
                }),
                catchError((otpError) =>
                  of(
                    SignupActions.signupFailure({
                      error: otpError.message || 'Failed to send OTP',
                    })
                  )
                )
              );
            }
            return of(
              SignupActions.signupFailure({
                error: response.message || 'Signup Failed',
              })
            );
          }),
          catchError((error) =>
            of(SignupActions.signupFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
