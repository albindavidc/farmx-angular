import { createReducer, on } from '@ngrx/store';
import { LoginState } from '../models/auth-state.model';
import { LoginActions } from '../actions/login.actions';

export const loginFeatureKey = 'login';

export const initialState: LoginState = {
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
    user: response.user,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    isLoading: false,
    isLoggedIn: true,
    error: null,
  })),
  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
