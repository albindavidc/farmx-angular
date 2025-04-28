import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Post } from '../../../shared/models/post.model';
import { CommunityPostState } from './community-post.reducer';

// Community Post Selectors
export const selectCommunityPostState =
  createFeatureSelector<CommunityPostState>('communityPost');

export const selectCommunityPosts = createSelector(
  selectCommunityPostState,
  (state) => state.posts
);

export const selectCommunityPostLoading = createSelector(
  selectCommunityPostState,
  (state) => state.loading
);

export const selectCommunityPostError = createSelector(
  selectCommunityPostState,
  (state) => state.error
);

export const selectCommunityPostById = (postId: string) =>
  createSelector(selectCommunityPosts, (posts) =>
    posts.find((post: Post) => post.id === postId)
  );
