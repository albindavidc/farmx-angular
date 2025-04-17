import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthActions } from '../../store/auth/actions/auth.actions';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const isAuthRoute =
    state.url.startsWith('/auth/login') ||
    state.url.startsWith('/auth/signup') ||
    state.url.startsWith('auth/otp-verification');

  return tokenService.checkAuthStatus().pipe(
    switchMap(({ isAuthenticated, user }) => {
      console.log(
        `${isAuthenticated} && ${user} these are the information in the front-end`
      );
      if (isAuthenticated && user) {
        const authUser = {
          id: user.id,
          email: user.email || '',
          name: user.name,
          password: '',
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified || false,
        };
        store.dispatch(AuthActions.setUser({ user: authUser }));

        if (isAuthRoute) {
          return of(router.createUrlTree([`/${user.role}/home`]));
        }

        return of(true);
      }
      if (isAuthRoute) {
        return of(true);
      }

      return tokenService.refreshToken().pipe(
        switchMap((refreshed) => {
          if (refreshed) {
            return tokenService.checkAuthStatus().pipe(
              switchMap(({ isAuthenticated, user }) => {
                if (isAuthenticated && user) {
                  const authUser = {
                    id: user.id,
                    email: user.email || '',
                    name: user.name,
                    password: '',
                    phone: user.phone,
                    role: user.role,
                    isVerified: user.isVerified || false,
                  };
                  store.dispatch(AuthActions.setUser({ user: authUser }));
                  return of(router.createUrlTree([`/${user.role}/home`]));
                }
                return of(
                  router.createUrlTree(['/auth/login'], {
                    queryParams: { redirectUrl: state.url },
                  })
                );
              })
            );
          }

          return of(
            router.createUrlTree(['/auth/login'], {
              queryParams: { redirectUrl: state.url },
            })
          );
        })
      );
    }),
    catchError((error) => {
      console.error(`Auth guard error`, error);
      return of(router.createUrlTree(['/auth/login']));
    })
  );
};
