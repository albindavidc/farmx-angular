import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { SignupRequestModel } from '../../../shared/models/signup.model';

export const SignupActions = createActionGroup({
  source: 'Auth',
  events: {
    Signup: props<{ userData: SignupRequestModel }>(),
    'Signup Success': props<{ tempUser: any }>(),
    'Signup Failure': props<{ error: string }>(),

    Logout: emptyProps(),
  },
});
