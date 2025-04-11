import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const LoginActions = createActionGroup({
  source: 'Login',
  events: {
    'Load Logins': emptyProps(),
    
    
  }
});
