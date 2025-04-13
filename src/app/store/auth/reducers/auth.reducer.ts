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
  on(
    AuthActions.refreshTokenSuccess,
    (state, { accessToken, refreshToken }) => ({
      ...state,
      accessToken,
      refreshToken,
      isLoading: false,
    })
  ),
  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(
    AuthActions.setUser,
    (state, { id, email, name, password, phone, role, isVerified }) => ({
      ...state,
      user: { id, email, name, password, phone, role, isVerified },
    })
  )
);
