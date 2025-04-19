import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const selectSettingsFeature =
  createFeatureSelector<SettingsState>('settings');

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
