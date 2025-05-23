import { createReducer, on } from '@ngrx/store';
import { ForgotPasswordActions } from '../actions/forgot-password.actions';

export const forgotPasswordFeatureKey = 'forgotPassword';

export interface forgotPasswordState {
  email: string;
  showEmailForm: boolean;
  showOtpForm: boolean;
  showChangePasswordForm: boolean;
  generateOtpStatus: { success: boolean; error?: string };
  validateOtpStatus: { success: boolean; error?: string };
  changePasswordStatus: { success: boolean; error?: string };
  isLoading: boolean;
}

export const initialState: forgotPasswordState = {
  email: '',
  showEmailForm: true,
  showOtpForm: false,
  showChangePasswordForm: false,
  generateOtpStatus: { success: false },
  validateOtpStatus: { success: false },
  changePasswordStatus: { success: false },
  isLoading: false,
};

export const forgotPasswordReducer = createReducer(
  /* Generate-Otp */
  initialState,
  on(ForgotPasswordActions.forgotPasswordGenerateOtp, (state, { email }) => ({
    ...state,
    email: email,
    isLoading: true,
  })),
  on(
    ForgotPasswordActions.forgotPasswordGenerateOtpSuccess,
    (state, { success }) => ({
      ...state,
      generateOtpStatus: { success: success },
      isLoading: false,
    })
  ),
  on(
    ForgotPasswordActions.forgotPasswordGenerateOtpFailure,
    (state, { error }) => ({
      ...state,
      generateOtpStatus: { success: false, error: error },
      isLoading: false,
    })
  ),

  /* Resend-Otp */
  on(ForgotPasswordActions.forgotPasswordResendOtp, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(
    ForgotPasswordActions.forgotPasswordResendOtpSuccess,
    (state, { success }) => ({
      ...state,
      generateOtpStatus: { success: success },
      isLoading: false,
    })
  ),
  on(
    ForgotPasswordActions.forgotPasswordResendOtpFailure,
    (state, { error }) => ({
      ...state,
      generateOtpStatus: { success: false, error: error },
      isLoading: false,
    })
  ),

  /* Change-Password */
  on(ForgotPasswordActions.changePassword, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(ForgotPasswordActions.changePasswordSuccess, (state, { success }) => ({
    ...state,
    success,
    isLoading: false,
  })),
  on(ForgotPasswordActions.changePasswordFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);
