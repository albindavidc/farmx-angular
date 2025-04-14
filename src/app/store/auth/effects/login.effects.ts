import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginActions } from '../actions/login.actions';
import { map, mergeMap, switchMap } from 'rxjs';
import { AuthActions } from '../actions/auth.actions';
import { LoginService } from '../services/login.service';
import { LoginResponse } from '../../../shared/models/login';

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
              AuthActions.navigateAfterAuth({ role: response.user.role }),
            ];
          })
        )
      )
    )
  );
}
