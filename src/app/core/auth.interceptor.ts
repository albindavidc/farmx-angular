import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthActions } from '../store/auth/actions/auth.actions';

const refreshingInProgress = { value: false };
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const store = inject(Store);
  const cookieService = inject(CookieService);

  /* Skipping for auth endpoints */
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/signup') ||
    req.url.includes('/auth/otp-verification') ||
    req.url.includes('/auth/user') ||
    req.url.includes('/auth/refresh-access-token') ||
    req.url.includes('/auth/logout')
  ) {
    return next(req);
  }

  let accessToken = cookieService.get('accessToken') || null;
  if (accessToken) {
    req = addToken(req, accessToken);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        !req.url.includes('/auth/refresh-access-token') &&
        cookieService.get('refreshToken')
      ) {
        return handle401Error(req, next, store);
      }
      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handle401Error(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  store: Store
): Observable<HttpEvent<any>> {
  if (!refreshingInProgress.value) {
    refreshingInProgress.value = true;
    refreshTokenSubject.next(null);

    store.dispatch(AuthActions.refreshToken());

    /* Waiting for the access token */
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        refreshingInProgress.value = false;
        refreshTokenSubject.next(token);
        return next(addToken(request, token as string));
      }),
      catchError((error) => {
        refreshingInProgress.value = false;

        store.dispatch(AuthActions.logout());
        return throwError(() => error);
      })
    );
  } else {
    /* Waiting for the ongoing refresh to complete */
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next(addToken(request, token as string));
      })
    );
  }
}
