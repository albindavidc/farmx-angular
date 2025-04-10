import {
  HttpErrorResponse,
  HttpEventType,
  HttpHandler,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import {
  selectAccessToken,
  selectRefreshToken,
} from './selectors/auth.selectors';
import { createActionGroup, Store } from '@ngrx/store';
import { OtpService } from './services/otp.service';
import {
  catchError,
  firstValueFrom,
  from,
  Observable,
  switchMap,
  throwError,
} from 'rxjs';
import { inject } from '@angular/core';
import { AuthActions } from './actions/auth.actions';
import { SignupActions } from './actions/signup.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const authService = inject(OtpService);

  return from(firstValueFrom(store.select(selectAccessToken))).pipe(
    switchMap((token) => {
      const clonedRequest = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

      return next(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return authService.refreshToken().pipe(
              switchMap((res: any) => {
                store.dispatch(
                  AuthActions.refreshTokenSuccess({
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                  })
                );
                const retiredRequest = req.clone({
                  setHeaders: { Authorization: `Bearer ${res.accessToken}` },
                });
                return next(retiredRequest);
              }),
              catchError((refreshError) => {
                store.dispatch(AuthActions.refreshTokenFailure(refreshError));
                store.dispatch(SignupActions.logout());
                return throwError(() => refreshError);
              })
            );
          }
          return throwError(() => error);
        })
      );
    })
  );
};
