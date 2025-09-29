import { createActionGroup, props } from '@ngrx/store';
import { User } from '../../shared/models/user/user.model';

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

    'Change Password': props<{
      newPassword: string;
      confirmPassword: string;
    }>(),
    'Change Password Success': props<{ success: boolean }>(),
    'Change Password Failure': props<{ error: string }>(),

    'Forgot Password Generate Otp': props<{ email: string }>(),
    'Forgot Password Generate Otp Success': props<{ success: boolean }>(),
    'Forgot Password Generate Otp Failure': props<{ error: string }>(),

    'Forgot Password Validate Otp': props<{ email: string; otp: string }>(),
    'Forgot Password Validate Otp Success': props<{ success: boolean }>(),
    'Forgot Password Validate Otp Failure': props<{ error: string }>(),

    'Forgot Password Resend Otp': props<{ email: string }>(),
    'Forgot Password Resend Otp Success': props<{ success: boolean }>(),
    'Forgot Password Resend Otp Failure': props<{ error: string }>(),
  },
});
