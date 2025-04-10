import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Set Access Token': props<{ accessToken: string }>(),
    'Set User': props<{
      id: string;
      email: string;
      name: string;
      password: string;
      phone: string;
      role: 'user' | 'farmer' | 'admin';
      isVerified: boolean;
    }>(),

    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{
      accessToken: string;
      refreshToken: string;
    }>(),
    'Refresh Token Failure': props<{ error: string }>(),
  },
});
