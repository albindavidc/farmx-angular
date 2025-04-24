import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TokenPayload } from '../services/token.service';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Set Access Token': props<{ accessToken: string }>(),
    'Set User': props<{
      user: {
        id: string;
        email: string;
        name: string;
        password: string;
        phone: string;
        role: 'user' | 'farmer' | 'admin';
        isVerified: boolean;
      };
    }>(),
    'Navigate After Auth': props<{ role: string }>(),
    'Set Loading': props<{ isLoading: boolean }>(),
    'Set Error': props<{ error: string | null }>(),

    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{ accessToken: string }>(),
    'Refresh Token Failure': emptyProps(),

    'Check Auth Status': emptyProps(),
    'Check Auth Status Success': props<{ data: TokenPayload }>(),
    'Check Auth Status Failure': props<{ error: string }>(),

    logout: emptyProps(),
  },
});
