import { createFeatureSelector, createSelector } from '@ngrx/store';
import { forgotPasswordState } from '../reducers/forgot-password.reducer';

export const selectForgotPasswordFeature =
  createFeatureSelector<forgotPasswordState>('forgotPassword');

export const selectForgotPasswordEmail = createSelector(
  selectForgotPasswordFeature,
  (state) => state.email
);

export const selectGeneratePasswordSuccess = createSelector(
  selectForgotPasswordFeature,
  (state) => state.generateOtpStatus.success
);

export const selectValidateOtpSuccess = createSelector(
  selectForgotPasswordFeature,
  (state) => state.validateOtpStatus.success
);

export const selectChangePasswordSuccess = createSelector(
  selectForgotPasswordFeature,
  (state) => state.changePasswordStatus.success
);

export const selectShowEmailForm = createSelector(
  selectForgotPasswordFeature,
  (state) => state.showEmailForm
)
export const selectShowOtpForm = createSelector(
  selectForgotPasswordFeature,
  (state) => state.showOtpForm
)
