import { createReducer, on } from '@ngrx/store';
import { SignupActions } from '../actions/signup.actions';
import { SignupState } from '../models/auth-state.model';

export const signupFeatureKey = 'signup';

export const initialState: SignupState = {
  isRegistered: false,
  tempUser: null,
  error: null,
  isLoading: false,
};

export const signupReducer = createReducer(
  initialState,
  on(SignupActions.signup, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(SignupActions.signupSuccess, (state, { tempUserId }) => ({
    ...state,
    isRegistered: true,
    tempUser: { id: tempUserId } as any,
    isLoading: false,
    error: null,
  })),

  on(SignupActions.signupFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
