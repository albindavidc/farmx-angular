import { createReducer, on } from '@ngrx/store';
import { LoginActions } from '../actions/login.actions';
import { LoginState } from '../../../shared/models/auth-state.model';

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
  on(LoginActions.loginSuccess, (state, { response }) => {
    const newState = {
      ...state,
      isLoggedIn: true,
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      error: null,
      isLoading: false,
    };
    localStorage.setItem('authState', JSON.stringify(newState)); // Persist entire state
    return newState;
  }),

  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(LoginActions.autoLogin, (state) => {
    const newState = { ...state, isLoading: true, error: null };
    localStorage.setItem('authState', JSON.stringify(newState));
    return newState;
  }),

  on(LoginActions.logout, (state) => {
    localStorage.removeItem('authState');
    return initialState;
  })
);
