import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OtpService } from '../services/otp.service';
import { OtpActions } from '../actions/otp.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class OtpEffects {
  private actions$ = inject(Actions);
  private otpService = inject(OtpService);

  verifyOtp$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OtpActions.verifyOtp),
      mergeMap(({ request }) =>
        this.otpService.verifyOtp(request).pipe(
          map((response) =>
            OtpActions.verifyOtpSuccess({ token: response.token })
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
}
