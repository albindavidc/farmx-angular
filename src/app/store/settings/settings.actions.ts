import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../../shared/models/auth-state.model';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Upload Profile Photo': props<{ formData: FormData }>(),
    'Upload Profile Photo Success': props<{ userId: string }>(),
    'Upload Profile Photo Failure': props<{ error: string }>(),

    'Get Profile Photo': props<{ userId: string | number }>(),
    'Get Profile Photo Success': props<{ photoUrl: string | null }>(),
    'Get Profile Photo Failure': props<{ error: string }>(),

    'Update Profile': props<{ updates: Partial<User> }>(),
    'Update Profile Success': props<{ profile: User }>(),
    'Update Profile Failure': props<{ error: string }>(),

    'Validate Old Password': props<{ oldPassword: string }>(),
    'Validate Old Password Success': props<{ isValid: boolean }>(),
    'Validate Old Password Failure': props<{ error: string }>(),
  },
});
