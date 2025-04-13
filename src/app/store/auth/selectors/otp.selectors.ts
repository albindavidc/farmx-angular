import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OTPState } from '../../../shared/models/auth-state.model';

export const selectOtpState = createFeatureSelector<OTPState>('otp');

export const selectIsVerified = createSelector(
  selectOtpState,
  (state) => state.isVerified
);

export const selectOtpError = createSelector(
  selectOtpState,
  (state) => state.error
);

export const selectOtpLoading = createSelector(
  selectOtpState,
  (state) => state.isLoading
);

export const selectRemainingAttempts = createSelector(
  selectOtpState,
  (state) => state.remainingAttempts
);

export const selectResendAvailableIn = createSelector(
  selectOtpState,
  (state) => state.resendAvailableIn
);

export const selectUserEmail = createSelector(
  selectOtpState,
  (state) => state.email
);

export const selectVerificationType = createSelector(
  selectOtpState,
  (state) => state.verificationType
);
