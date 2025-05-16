import { createReducer, on } from '@ngrx/store';
import { CommunityPostActions } from './community-post.actions';
import { Post } from '../../../shared/models/post.model';

export const communityPostFeatureKey = 'communityPost';

export interface CommunityPostState {
  posts: Post[];
  loading: boolean;
  error: any;
}

export const initialState: CommunityPostState = {
  posts: [],
  loading: false,
  error: null,
};

export const communityPostReducer = createReducer(
  initialState,

  // Load posts
  on(CommunityPostActions.loadPosts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CommunityPostActions.loadPostsSuccess, (state, { posts }) => ({
    ...state,
    posts,
    loading: false,
    error: null,
  })),
  on(CommunityPostActions.loadPostsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create post
  on(CommunityPostActions.createPost, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CommunityPostActions.createPostSuccess, (state, { post }) => ({
    ...state,
    posts: [post, ...state.posts], // Add new post at the beginning
    loading: false,
    error: null,
  })),
  on(CommunityPostActions.createPostFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Edit post
  on(CommunityPostActions.editPost, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CommunityPostActions.editPostSuccess, (state, { post }) => ({
    ...state,
    posts: state.posts.map((p) => (p.id === post.id ? post : p)),
    loading: false,
  })),
  on(CommunityPostActions.editPostFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete post (continuation)
  on(CommunityPostActions.deletePost, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CommunityPostActions.deletePostSuccess, (state, { postId }) => ({
    ...state,
    posts: state.posts.filter((post) => post.id !== postId),
    loading: false,
  })),
  on(CommunityPostActions.deletePostFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
