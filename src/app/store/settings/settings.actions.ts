import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Upload Profile Photo': props<{ formData: FormData }>(),
    'Upload Profile Photo Success': props<{ userId: string }>(),
    'Upload Profile Photo Failure': props<{ error: string }>(),

    'Get Profile Photo': props<{ userId: string | number }>(),
    'Get Profile Photo Success': props<{ photoUrl: string | null }>(),
    'Get Profile Photo Failure': props<{ error: string }>(),
  },
});
