import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  catchError,
  filter,
  map,
  Observable,
  of,
  skip,
  switchMap,
  take,
  timeout,
} from 'rxjs';
import { TokenService } from '../../store/auth/services/token.service';
import { AuthActions } from '../../store/auth/actions/auth.actions';
import {
  selectIsAuthenticated,
  selectUser,
} from '../../store/auth/selectors/auth.selectors';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  const isAuthRoute =
    state.url.startsWith('/auth/login') ||
    state.url.startsWith('/auth/signup') ||
    state.url.startsWith('auth/otp-verification') ||
    state.url.startsWith('auth/forgot-password');

  return store.select(selectIsAuthenticated).pipe(
    take(1),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return store.select(selectUser).pipe(
          take(1),
          map((user) => {
            if (!user) return true;
            if (user) {
              if (isAuthRoute) {
                console.log('navigating to the user', user, user.role);
                return router.createUrlTree([`/${user.role}/home`]);
              }
            }
            return true;
          })
        );
      }
      return true;
    }),
    switchMap((result) => (typeof result === 'boolean' ? of(result) : result))
  );
};
