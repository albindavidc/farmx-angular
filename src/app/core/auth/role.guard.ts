import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of, switchMap, take, withLatestFrom } from 'rxjs';
import {
  selectIsAuthenticated,
  selectUser,
} from '../../store/auth/selectors/auth.selectors';
import { AuthActions } from '../../store/auth/actions/auth.actions';
import { Actions, ofType } from '@ngrx/effects';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);
  const actions$ = inject(Actions);
  const requiredRoles = route.data['roles'] as string[] | undefined;

  store.dispatch(AuthActions.checkAuthStatus());
  return actions$.pipe(
    ofType(
      AuthActions.checkAuthStatusSuccess,
      AuthActions.checkAuthStatusFailure
    ),
    take(1),
    withLatestFrom(store.select(selectIsAuthenticated)),
    switchMap((isAuthenticated) => {
      if (!isAuthenticated) {
        console.log('this is the auth state in the front-end', isAuthenticated);
        return of(
          router.createUrlTree(['/auth/login'], {
            queryParams: { redirectUrl: state.url },
          })
        );
      }
      return store.select(selectUser).pipe(
        take(1),
        map((user) => {
          console.log('this is the user in the front-end', user, user?.role);
          if (!user) {
            return router.createUrlTree(['/auth/login']);
          }

          if (!requiredRoles || requiredRoles.includes(user.role)) {
            return true;
          }
          return router.createUrlTree(['/unauthorized']);
        })
      );
    })
  );
};
