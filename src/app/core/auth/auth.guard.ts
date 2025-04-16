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
        return of(true);
      }

      return tokenService.refreshToken().pipe(
        map((refreshed) => {
          if (refreshed) {
            return router.createUrlTree(['/'], {
              queryParams: { redirectUrl: state.url },
            });
          }

          return router.createUrlTree(['/auth/login'], {
            queryParams: { redirectUrl: state.url },
          });
        })
      );
    }),
    catchError(() => {
      return of(router.createUrlTree(['/auth/login']));
    })
  );
};
