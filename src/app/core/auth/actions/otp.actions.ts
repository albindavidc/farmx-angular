import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ResendOtpRequest, VerifyOtpRequest } from '../models/otp.model';
import { User } from '../models/auth-state.model';

export const OtpActions = createActionGroup({
  source: 'Auth',
  events: {
    'Verify Otp': props<{ request: VerifyOtpRequest }>(),
    'Verify Otp Success': props<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>(),
    'Verify Otp Failure': props<{ error: string }>(),

    'Resend Otp': props<{ request: ResendOtpRequest }>(),
    'Resend Otp Success': emptyProps(),
    'Resend Otp Failure': props<{ error: string }>(),
  },
});
