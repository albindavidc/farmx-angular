import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SignupState } from '../../../shared/models/auth-state.model';

export const selectSignupState = createFeatureSelector<SignupState>('signup');

export const selectIsRegistered = createSelector(
  selectSignupState,
  (state) => state.isRegistered
);

export const selectTempUserId = createSelector(
  selectSignupState,
  (state) => state.tempUser?.id
);

export const selectSignupLoading = createSelector(
  selectSignupState,
  (state) => state.isLoading
);

export const selectSignupError = createSelector(
  selectSignupState,
  (state) => state.error
);
