import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommunityState } from './community.reducer';

export const selectCommunityState =
  createFeatureSelector<CommunityState>('community');

export const selectAllCommunities = createSelector(
  selectCommunityState,
  (state) => state.communities
);

export const selectCurrentCommunity = createSelector(
  selectCommunityState,
  (state) => state.currentCommunity
);
export const selectCommunityLoading = createSelector(
  selectCommunityState,
  (state) => state.isLoading
);

export const selectCommunityError = createSelector(
  selectCommunityState,
  (state) => state.error
);

export const selectJoinedCommunity = createSelector(
  selectCommunityState,
  (state) => state.joinedCommunity
);
