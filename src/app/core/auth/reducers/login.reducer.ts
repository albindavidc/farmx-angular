import { createReducer, on } from '@ngrx/store';
import { LoginState } from '../models/auth-state.model';
import { LoginActions } from '../actions/login.actions';

export const loginFeatureKey = 'login';

export const initialState: LoginState = {
  isLoggedIn: false,
  error: null,
  isLoading: false,
};

export const loginReducer = createReducer(
  initialState,
  on(LoginActions.loadLogin, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(LoginActions.loginSuccess, (state) => ({
    ...state,
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
