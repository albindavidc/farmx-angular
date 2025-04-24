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
import { TokenService } from '../services/token.service';
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
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
