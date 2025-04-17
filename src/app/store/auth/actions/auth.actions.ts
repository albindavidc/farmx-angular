import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Set Access Token': props<{ accessToken: string }>(),
    'Set User': props<{
      user: {
        id: string;
        email: string ;
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
    'Refresh Token Success': emptyProps(),
    'Refresh Token Failure': emptyProps(),

    logout: emptyProps(),
  },
});
