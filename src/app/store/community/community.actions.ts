import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  Community,
  createCommunityRequest,
} from '../../shared/models/community.model';

export const CommunityActions = createActionGroup({
  source: 'Community',
  events: {
    'Create Community': props<{ request: createCommunityRequest }>(),
    'Create Community Success': props<{ community: Community }>(),
    'Create Community Failure': props<{ error: string }>(),

    'Load Communities': props<{ createdById: string }>(),
    'Load Communities Success': props<{ communities: Community[] }>(),
    'Load Communities Failure': props<{ error: string }>(),

    'Load Community': props<{ communityId: string }>(),
    'Load Community Success': props<{ community: Community }>(),
    'Load Community Failure': props<{ error: string }>(),

    'Join Community': props<{ communityId: string }>(),
    'Join Community Success': props<{ success: boolean }>(),
    'Join Community Failure': props<{ error: string }>(),

    'Leave Community': props<{ communityId: string }>(),
    'Leave Community Success': props<{ success: boolean }>(),
    'Leave Community Failure': props<{ error: string }>(),
  },
});
