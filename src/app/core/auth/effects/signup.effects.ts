import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { SignupService } from '../services/signup.service';
import { SignupActions } from '../actions/signup.actions';
import { OtpService } from '../services/otp.service';

@Injectable()
export class SignupEffects {
  private actions$ = inject(Actions);
  private signupService = inject(SignupService);
  private otpService = inject(OtpService);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignupActions.signup),
      mergeMap(({ userData }) =>
        this.signupService.register(userData).pipe(
          map((response) => {
            if (response.success && response.tempUser) {
              this.otpService.sendOtp(userData.email).subscribe();
              return SignupActions.signupSuccess({
                tempUser: response.tempUser,
              });
            }
            return SignupActions.signupFailure({
              error: response.message || 'Signup Failed',
            });
          }),
          catchError((error) =>
            of(
              SignupActions.signupFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );
}
