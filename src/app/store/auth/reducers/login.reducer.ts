import { createReducer, on } from '@ngrx/store';
import { LoginActions } from '../actions/login.actions';
import { LoginState } from '../../../shared/models/auth-state.model';

export const loginFeatureKey = 'login';

export const initialState: LoginState = {
  isAuthenticated: false,
  email: '',
  isLoggedIn: false,
  error: null,
  isLoading: false,
  user: null,
  accessToken: '',
  refreshToken: '',
};

export const loginReducer = createReducer(
  initialState,
  on(LoginActions.loadLogin, (state, { request }) => ({
    ...state,
    email: request.email,
    isLoading: true,
    error: null,
  })),
  on(LoginActions.loginSuccess, (state, { response }) => ({
    ...state,
    isAuthenticated: true,
    isLoggedIn: true,
    user: response.data,
    error: null,
    isLoading: false,
  })),

  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
