import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { LoginRequest, LoginResponse } from '../../../shared/models/login';

export const LoginActions = createActionGroup({
  source: 'Login',
  events: {
    'Load Login': props<{ request: LoginRequest }>(),
    'Login Success': props<{ response: LoginResponse }>(),
    'Login Failure': props<{ error: string }>(),

    'Auto Login': emptyProps(),
    'logout': emptyProps()
  },
});
