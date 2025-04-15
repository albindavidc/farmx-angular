import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { TokenService } from '../services/token.service';
import { Store } from '@ngrx/store';
import { AuthActions } from '../../store/auth/actions/auth.actions';
import { Actions, ofType } from '@ngrx/effects';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const tokenService = inject(TokenService);
  const store = inject(Store);
  const actions$ = inject(Actions);

  const isRefreshing = new BehaviorSubject<boolean>(false);
  const refreshTokenSubject = new BehaviorSubject<string | null>(null);

  const addToken = (
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> => {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handle401Error = (
    request: HttpRequest<any>,
    nextHandler: HttpHandlerFn
  ): Observable<HttpEvent<any>> => {
    if (!isRefreshing.value) {
      isRefreshing.next(true);
      refreshTokenSubject.next(null);

      const refreshToken = tokenService.getRefreshToken();
      if (refreshToken) {
        store.dispatch(AuthActions.refreshToken());
        return actions$.pipe(
          ofType(AuthActions.refreshTokenSuccess),
          take(1),
          switchMap(() => {
            const newAccessToken = tokenService.getAccessToken();
            if (newAccessToken) {
              refreshTokenSubject.next(newAccessToken);
              console.log(
                `new accesstoken has been generated through interceptor in the front-end: ${newAccessToken}`
              );
              return nextHandler(addToken(request, newAccessToken));
            }
            return throwError(() => new Error(`Failed to refresh the token`));
          }),
          catchError((error) => {
            store.dispatch(AuthActions.logout());
            return throwError(() => error);
          }),
          finalize(() => {
            isRefreshing.next(false);
          })
        );
      } else {
        store.dispatch(AuthActions.logout());
        return throwError(() => new Error(`No refresh token available`));
      }
    } else {
      return refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => nextHandler(addToken(request, token!)))
      );
    }
  };

  const accessToken = tokenService.getAccessToken();
  let authReq = req;

  if (accessToken) {
    authReq = addToken(req, accessToken);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return handle401Error(authReq, next);
      }
      return throwError(() => error);
    })
  );
};
