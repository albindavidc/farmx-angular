import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';
import { AuthState } from '../../../shared/models/auth-state.model';

export const authFeatureKey = 'auth';

export const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: false,
  accessToken: null,
  refreshToken: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.refreshTokenSuccess, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(AuthActions.refreshTokenFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(AuthActions.setUser, (state, { user }) => ({
    ...state,
    user,
  })),
  on(AuthActions.setAccessToken, (state, { accessToken }) => ({
    ...state,
    accessToken,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading,
  })),
  on(AuthActions.setError, (state, { error }) => ({
    ...state,
    error,
  })),
  on(AuthActions.logout, (state) => {
    localStorage.removeItem('authState');
    return initialState;
  })
);
