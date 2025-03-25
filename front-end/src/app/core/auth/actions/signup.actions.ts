import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SignupRequestModel } from '../models/signup-request.model';

export const SignupActions = createActionGroup({
  source: 'Auth',
  events: {
    'Signup': props<{ userData: SignupRequestModel }>(),
    'Signup Success': props<{ tempUserId: string }>(),
    'Signup Failure': props<{ error: string }>(),
  },
});
