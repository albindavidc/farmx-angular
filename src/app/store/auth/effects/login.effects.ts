import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoginActions } from '../actions/login.actions';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { AuthActions } from '../actions/auth.actions';
import { LoginService } from '../services/login.service';
import { LoginResponse } from '../../../shared/models/login';
import { TokenService } from '../../../core/services/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OtpService } from '../services/otp.service';
import { Router } from '@angular/router';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private loginService = inject(LoginService);
  private tokenService = inject(TokenService);

  private otpService = inject(OtpService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.loadLogin),
      mergeMap(({ request }) =>
        this.loginService.login(request).pipe(
          switchMap((response: LoginResponse) => {
            this.tokenService.setToken(
              response.accessToken,
              response.refreshToken
            );
            return [
              LoginActions.loginSuccess({
                response: {
                  user: response.user,
                  accessToken: response.accessToken,
                  refreshToken: response.refreshToken,
                },
              }),
              // AuthActions.setAccessToken({ accessToken: response.accessToken }),
              // AuthActions.setUser({
              //   id: response.user.id,
              //   email: response.user.email,
              //   name: response.user.name,
              //   password: '',
              //   phone: response.user.phone,
              //   role: response.user.role,
              //   isVerified: response.user.isVerified,
              // }),
              // AuthActions.refreshTokenSuccess({
              //   accessToken: response.accessToken,
              // }),
              AuthActions.navigateAfterAuth({ role: response.user.role }),
            ];
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              LoginActions.loginFailure({
                error: error.error.message || 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      exhaustMap(() => {
        const refreshToken = this.tokenService.getRefreshToken();
        if (!refreshToken) {
          return of(
            AuthActions.refreshTokenFailure({
              error: 'No refresh token in the localstorage. error from effects',
            })
          );
        }
        return this.otpService.refreshToken(refreshToken).pipe(
          map((response) => {
            localStorage.setItem('access_token', response.accessToken);

            return AuthActions.refreshTokenSuccess({
              accessToken: response.accessToken,
            });
          }),
          catchError((error) => {
            this.tokenService.clearToken();
            return of(
              AuthActions.refreshTokenFailure({ error: error.message })
            );
          })
        );
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.tokenService.clearToken();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
