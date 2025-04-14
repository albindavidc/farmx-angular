import { CanActivateFn, Router } from '@angular/router';
import { selectAccessToken } from '../../store/auth/selectors/auth.selectors';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectAccessToken).pipe(
    take(1),
    map((token) => {
      if (!token) {
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
      return true;
    })
  );
};
