import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SignupActions } from '../actions/signup.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { SignupService } from '../services/signup.service';

@Injectable()
export class SignupEffects {
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SignupActions.signup),
      mergeMap(({ userData }) =>
        this.signupService.register(userData).pipe(
          map((response) =>
            SignupActions.signupSuccess({ tempUserId: response.tempUserId })
          ),
          catchError((error) =>
            of(SignupActions.signupFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private signupService: SignupService
  ) {}
}
