import { createReducer, on } from '@ngrx/store';

export const loginFeatureKey = 'login';

export interface State {

}

export const initialState: State = {

};

export const loginReducer = createReducer(
  initialState,
);

