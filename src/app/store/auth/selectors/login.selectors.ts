import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginState } from '../../../shared/models/auth-state.model';

export const selectLoginState = createFeatureSelector<LoginState>('login');

export const selectLoginEmail = createSelector(
  selectLoginState,
  (state) => state.email
);

export const selectIsLoggedIn = createSelector(
  selectLoginState,
  (state) => state.isLoggedIn
);

export const selectLoginUser = createSelector(
  selectLoginState,
  (state) => state.user
);

export const selectLoginLoading = createSelector(
  selectLoginState,
  (state) => state.isLoading
);

export const selectLoginError = createSelector(
  selectLoginState,
  (state) => state.error
);

export const selectLoginAccessToken = createSelector(
  selectLoginState,
  (state) => state.accessToken
);

export const selectLoginRefreshToken = createSelector(
  selectLoginState,
  (state) => state.refreshToken
);
