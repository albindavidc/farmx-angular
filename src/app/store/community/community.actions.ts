import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Community } from '../../shared/models/community.model';

export const CommunityActions = createActionGroup({
  source: 'Community',
  events: {
    'Load Communities': emptyProps(),
    'Load Communities Success': props<{ communities: Community[] }>(),
    'Load Communities Failure': props<{ error: string }>(),

    'Load Community': props<{ communityId: string }>(),
    'Load Community Success': props<{ community: Community }>(),
    'Load Community Failure': props<{ error: string }>(),
  },
});
