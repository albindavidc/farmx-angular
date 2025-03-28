import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { SignupService } from '../services/signup.service';
import { SignupActions } from '../actions/signup.actions';

@Injectable()
export class SignupEffects {
  private actions$ = inject(Actions);
  private signupService = inject(SignupService);

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignupActions.signup),
      mergeMap(({ userData }) =>
        this.signupService.register(userData).pipe(
          map((response) =>
            SignupActions.signupSuccess({
              tempUserId: response.tempUserId,
            })
          ),
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
