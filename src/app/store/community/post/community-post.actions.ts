import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Post } from '../../../shared/models/post.model';

export const CommunityPostActions = createActionGroup({
  source: 'CommunityPost',
  events: {
    'Create Post': props<{ text: string; image?: File; communityId: string }>(),
    'Create Post Success': props<{ post: Post }>(),
    'Create Post Failure': props<{ error: any }>(),

    'Load Posts': props<{ communityId: string }>(),
    'Load Posts Success': props<{ posts: Post[] }>(),
    'Load Posts Failure': props<{ error: any }>(),

    'Edit Post': props<{ postId: string; text: string; image?: File }>(),
    'Edit Post Success': props<{ post: Post }>(),
    'Edit Post Failure': props<{ error: any }>(),

    'Delete Post': props<{ postId: string }>(),
    'Delete Post Success': props<{ postId: string }>(),
    'Delete Post Failure': props<{ error: any }>(),
  },
});
