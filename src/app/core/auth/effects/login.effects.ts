import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginService } from '../services/login.service';
import { LoginActions } from '../actions/login.actions';
import { map, mergeMap, switchMap } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/login';
import { AuthActions } from '../actions/auth.actions';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private loginService = inject(LoginService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.loadLogin),
      mergeMap(({ request }) =>
        this.loginService.login(request).pipe(
          switchMap((response: LoginResponse) => {
            return [
              LoginActions.loginSuccess({
                response: {
                  user: response.user,
                  accessToken: response.accessToken,
                  refreshToken: response.refreshToken,
                },
              }),
              AuthActions.navigateAfterAuth({ role: response.user.role }),
            ];
          })
        )
      )
    )
  );
}
