import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginService } from '../services/login.service';
import { LoginActions } from '../actions/login.actions';
import { map, mergeMap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private loginService = inject(LoginService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.loadLogin),
      mergeMap(({ request }) =>
        this.loginService.login(request).pipe(
          map((response: LoginResponse) => {
            return LoginActions.loginSuccess({
              response: {
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
              },
            });
          })
        )
      )
    )
  );
}
