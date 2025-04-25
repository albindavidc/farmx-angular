import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Post } from '../../../shared/models/post.model';

export const CommunityPostActions = createActionGroup({
  source: 'CommunityPost',
  events: {
    'Create Post': props<{ text: string; image?: File; communityId: string }>,
    'Create Post Success': props<{ post: Post }>(),
    'Create Post Failure': props<{ error: string }>(),

    'Load Post': props<{ communityId: string }>(),
    'Load Post Success': props<{ posts: Post[] }>(),
    'Load Post Failure': props<{ error: string }>(),
  },
});
