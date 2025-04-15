import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, take } from 'rxjs';
import { AuthActions } from '../../store/auth/actions/auth.actions';
import { selectUser } from '../../store/auth/selectors/auth.selectors';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as Array<string>;

  return store.select(selectUser).pipe(
    take(1),
    map((user) => {
      if (user && requiredRoles.includes(user.role)) {
        return true;
      }

      return router.createUrlTree(['/auth/login']);
    })
  );
};
