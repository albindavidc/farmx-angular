import { createReducer, on } from '@ngrx/store';
import { CommunityActions } from './community.actions';
import { Community } from '../../shared/models/community.model';

export const communityFeatureKey = 'community';

export interface CommunityState {
  communities: Community[];
  currentCommunity: Community | null;
  isLoading: boolean;
  error: any;
  joinedCommunity: string;
}

export const initialState: CommunityState = {
  communities: [],
  currentCommunity: null,
  isLoading: false,
  error: null,
  joinedCommunity: '',
};

export const reducer = createReducer(
  initialState,
  on(CommunityActions.loadCommunities, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(CommunityActions.loadCommunitiesSuccess, (state, { communities }) => ({
    ...state,
    isLoading: false,
    communities,
    error: null,
  })),
  on(CommunityActions.loadCommunitiesFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CommunityActions.loadCommunity, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(CommunityActions.loadCommunitySuccess, (state, { community }) => ({
    ...state,
    isLoading: false,
    currentCommunity: community,
    error: null,
  })),
  on(CommunityActions.loadCommunityFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error: null,
  })),

  on(CommunityActions.joinCommunity, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(CommunityActions.joinCommunitySuccess, (state, { communityId }) => ({
    ...state,
    isLoading: false,
    joinedCommunity: communityId,
    error: null,
  })),
  on(CommunityActions.joinCommunityFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),

  on(CommunityActions.leaveCommunity, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(CommunityActions.leaveCommunitySuccess, (state, success) => ({
    ...state,
    isLoading: false,
    success,
    error: null,
  })),
  on(CommunityActions.leaveCommunityFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  }))
);
