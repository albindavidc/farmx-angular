import { createReducer, on } from '@ngrx/store';
import { OTPState } from '../models/auth-state.model';
import { OtpActions } from '../actions/otp.actions';

export const otpFeatureKey = 'otp';

export const initialState: OTPState = {
  isVerified: false,
  error: null,
  isLoading: false,
  remainingAttempts: 3,
  resendAvailableIn: 60,
  email: '',
  verificationType: 'email',
};

export const otpReducer = createReducer(
  initialState,
  on(OtpActions.verifyOtp, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(OtpActions.verifyOtpSuccess, (state) => ({
    ...state,
    error: null,
    isVerified: true,
    isLoading: false,
  })),

  on(OtpActions.verifyOtpFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    remainingAttempts: initialState.remainingAttempts - 1,
  })),

  on(OtpActions.resendOtp, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(OtpActions.resendOtpSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
    resendAvailableIn: 60,
  })),

  on(OtpActions.resendOtpFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
