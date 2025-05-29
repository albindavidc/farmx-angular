import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ForgotPasswordActions = createActionGroup({
  source: 'ForgotPassword',
  events: {
    'Forgot Password Generate Otp': props<{ email: string }>(),
    'Forgot Password Generate Otp Success': props<{ success: boolean }>(),
    'Forgot Password Generate Otp Failure': props<{ error: string }>(),

    'Forgot Password Resend Otp': props<{ email: string }>(),
    'Forgot Password Resend Otp Success': props<{ success: boolean }>(),
    'Forgot Password Resend Otp Failure': props<{ error: string }>(),

    'Forgot Password Validate Otp': props<{ email: string; otp: string }>(),
    'Forgot Password Validate Otp Success': props<{ success: boolean }>(),
    'Forgot Password Validate Otp Failure': props<{ error: string }>(),

    'Change Password': props<{
      newPassword: string;
      confirmPassword: string;
      email: string;
    }>(),
    'Change Password Success': props<{ success: boolean }>(),
    'Change Password Failure': props<{ error: string }>(),
  },
});
