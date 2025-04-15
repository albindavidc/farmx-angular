import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { selectAccessToken } from '../../store/auth/selectors/auth.selectors';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, take, withLatestFrom } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthActions } from '../../store/auth/actions/auth.actions';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return store.select(selectAccessToken).pipe(
    take(1),
    withLatestFrom(store.select(selectAccessToken)),

    map((accessToken) => {
      if (accessToken && !tokenService.isAccessTokenExpired()) {
        return true;
      }

      if (tokenService.getRefreshToken()) {
        store.dispatch(AuthActions.refreshToken());
        return router.createUrlTree(['/'], {
          queryParams: { redirectUrl: state.url },
        });
      }

      return router.createUrlTree(['/auth/login'], {
        queryParams: { redirectUrl: state.url },
      });
    })
  );
};
