import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Load Settingss': emptyProps(),

    'Upload Profile Photo': props<{ formData: FormData }>(),
    'Upload Profile Photo Failure': props<{ error: string }>(),
  },
});
