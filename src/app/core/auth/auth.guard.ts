import { CanActivateFn } from '@angular/router';
import { selectAccessToken } from '../../store/auth/selectors/auth.selectors';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);

  return store.select(selectAccessToken).pipe(
    map((token) => {
      if (!token) {
        return false;
      }
      return true;
    })
  );
};
