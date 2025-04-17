import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { AuthActions } from '../../store/auth/actions/auth.actions';
import { selectUser } from '../../store/auth/selectors/auth.selectors';
import { TokenService } from '../services/token.service';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);
  const tokenService = inject(TokenService);

  const requiredRoles = (route.data['roles'] as string[]) || undefined;

  return tokenService.checkAuthStatus().pipe(
    switchMap(({ isAuthenticated, user }) => {
      if (isAuthenticated && user) {
        return store.select(selectUser).pipe(
          take(1),
          map((storedUser) => {
            const requiredRoles = route.data['roles'] as string[] | undefined;
            if (
              !requiredRoles ||
              (storedUser && requiredRoles.includes(storedUser.role))
            ) {
              return true;
            }
            return router.createUrlTree(['/auth/login']);
          })
        );
      }

      return of(router.createUrlTree(['/auth/login']));
    })
  );
};
