import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { LoginResponse } from '../../../shared/models/login';
import { AuthActions } from '../actions/auth.actions';
import { LoginActions } from '../actions/login.actions';
import { LoginService } from '../services/login.service';
import { OtpService } from '../services/otp.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class LoginEffects {
  private actions$ = inject(Actions);
  private loginService = inject(LoginService);
  private tokenService = inject(TokenService);

  private otpService = inject(OtpService);
  private router = inject(Router);
  private authService = inject(TokenService);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.loadLogin),
      mergeMap(({ request }) =>
        this.loginService.login(request).pipe(
          switchMap((response: LoginResponse) => {
            // this.tokenService.setToken(
            //   response.accessToken,
            //   response.refreshToken
            // );
            console.log('We are going to redirect to the home', response.data);
            return [
              LoginActions.loginSuccess({
                response: {
                  data: response.data,
                },
              }),
              AuthActions.setUser({
                user: response.data,
              }),
              AuthActions.navigateAfterAuth({
                role: response.data.role.toLowerCase(),
              }),
            ];
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              LoginActions.loginFailure({
                error: 'Login failed',
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
        return this.authService.refreshToken().pipe(
          map((response) => {
            AuthActions.setAccessToken({ accessToken: response.accessToken });

            return AuthActions.refreshTokenSuccess({
              accessToken: response.accessToken,
            });
          }),
          catchError((error) => {
            return of(AuthActions.refreshTokenFailure());
          })
        );
      })
    )
  );

  checkAuthStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkAuthStatus),
      switchMap(() =>
        this.tokenService.checkAuthStatus().pipe(
          map((response) => {
            console.log(
              'this is the user in the check auth status',
              response.data
            );
            if (response.data) {
              AuthActions.setUser({ user: response.data });
              return AuthActions.checkAuthStatusSuccess({
                data: response.data,
              });
            }
            return AuthActions.checkAuthStatusFailure({
              error: 'Error in checking the status of the user',
            });
          }),
          catchError(() =>
            of(
              AuthActions.checkAuthStatusFailure({
                error: 'Error while checking the user status',
              })
            )
          )
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('authState');
          localStorage.removeItem('user');
          localStorage.removeItem('initialState');

          this.router.navigate(['/login'], { replaceUrl: true });
        }),
        switchMap(() => this.authService.logout())
      ),
    { dispatch: false }
  );
}
