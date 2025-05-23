import { createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';
import { User } from '../../shared/models/auth-state.model';

export const settingsFeatureKey = 'settings';

export interface SettingsState {
  email: string;
  photoUrl: string | null;
  profile: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;

  isOldPasswordValid: boolean;
}

export const initialState: SettingsState = {
  email: '',
  photoUrl: null,
  profile: null,
  loading: false,
  error: null,
  success: false,

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
  on(SettingsActions.forgotPasswordGenerateOtp, (state, { email }) => ({
    ...state,
    email: email,
  })),
  on(
    SettingsActions.forgotPasswordGenerateOtpSuccess,
    (state, { success }) => ({
      ...state,
      success: success,
    })
  ),
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
  })),
  on(SettingsActions.changePasswordSuccess, (state, { success }) => ({
    ...state,
    success,
  })),
  on(SettingsActions.changePasswordFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
