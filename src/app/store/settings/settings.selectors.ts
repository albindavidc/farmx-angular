import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const selectSettingsFeature =
  createFeatureSelector<SettingsState>('settings');

/* Profile Selectors */
export const selectProfilePhotoUrl = createSelector(
  selectSettingsFeature,
  (state) => state.photoUrl
);

export const selectPhotoError = createSelector(
  selectSettingsFeature,
  (state) => state.error
);

export const selectProfileLoading = createSelector(
  selectSettingsFeature,
  (state) => state.loading
);

export const selectProfile = createSelector(
  selectSettingsFeature,
  (state) => state.profile
);

export const selectProfileError = createSelector(
  selectSettingsFeature,
  (state) => state.error
);

/* Security Selectors */
export const selectForgotPasswordSuccess = createSelector(
  selectSettingsFeature,
  (state) => state.success
);

export const selectGeneratePasswordSuccess = createSelector(
  selectSettingsFeature,
  (state) => state.success
)

export const selectForgotPasswordEmail = createSelector(
  selectSettingsFeature,
  (state) => state.email
);

export const selectisOldPasswordValid = createSelector(
  selectSettingsFeature,
  (state) => state.isOldPasswordValid
);

export const selectChangePasswordState = createSelector(
  selectSettingsFeature,
  (state) => state.success
);
