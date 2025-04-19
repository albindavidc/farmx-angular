import { createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';

export const settingsFeatureKey = 'settings';

export interface SettingsState {
  photoUrl: string | null;
  error: string | null;
}

export const initialState: SettingsState = {
  photoUrl: null,
  error: null,
};

export const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.getProfilePhotoSuccess, (state, { photoUrl }) => ({
    ...state,
    photoUrl,
    error: null,
  })),
  on(SettingsActions.getProfilePhotoFailure, (state, { error }) => ({
    ...state,
    photoUrl: null,
    error:error,
  }))
);
