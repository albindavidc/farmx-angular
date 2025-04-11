import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LoginState } from '../models/auth-state.model';

export const selectLoginState = createFeatureSelector<LoginState>('login');

export const selectEmail = createSelector(
  selectLoginState,
  (state) => state.email
);

export const selectIsLoggedIn = createSelector(
  selectLoginState,
  (state) => state.isLoggedIn
);

export const selectUser = createSelector(
  selectLoginState,
  (state) => state.user
);

export const selectIsLoading = createSelector(
  selectLoginState,
  (state) => state.isLoading
);

export const selectError = createSelector(
  selectLoginState,
  (state) => state.error
);

export const selectAccessToken = createSelector(
  selectLoginState,
  (state) => state.accessToken
);

export const selectRefreshToken = createSelector(
  selectLoginState,
  (state) => state.refreshToken
);
