import { createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';
import { User } from '../../shared/models/auth-state.model';

export const settingsFeatureKey = 'settings';

export interface SettingsState {
  photoUrl: string | null;
  profile: User | null;
  loading: boolean;
  error: string | null;

  isOldPasswordValid: boolean;
}

export const initialState: SettingsState = {
  photoUrl: null,
  profile: null,
  loading: false,
  error: null,

  isOldPasswordValid: false,
};

export const settingsReducer = createReducer(
  initialState,

  /* Profile Reducers */
  on(SettingsActions.getProfilePhotoSuccess, (state, { photoUrl }) => ({
    ...state,
    photoUrl,
    error: null,
  })),
  on(SettingsActions.getProfilePhotoFailure, (state, { error }) => ({
    ...state,
    photoUrl: null,
    error: error,
  })),
  on(SettingsActions.updateProfile, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(SettingsActions.updateProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(SettingsActions.updateProfileFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  /* Security Reducers */
  on(SettingsActions.validateOldPassword, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SettingsActions.validateOldPasswordSuccess, (state, { isValid }) => ({
    ...state,
    isOldPasswordValid: isValid,
    loading: false,
  })),
  on(SettingsActions.validateOldPasswordFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
