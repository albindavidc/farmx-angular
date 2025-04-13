import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../../shared/models/auth-state.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.accessToken
);

export const selectRefreshToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.refreshToken
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);
