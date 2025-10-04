import { ActionReducer, MetaReducer } from '@ngrx/store';
import { AuthActions } from './auth/actions/auth.actions';

export function clearStateMetaReducer(
  reducer: ActionReducer<any>
): ActionReducer<any> {
  return function (state, action) {
    if (action.type === AuthActions.logout.type) {
      state = undefined;
    }
    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer[] = [clearStateMetaReducer];
