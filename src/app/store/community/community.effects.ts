import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommunityService } from './community.service';
import { CommunityActions } from './community.actions';
import {
  catchError,
  exhaustMap,
  map,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';

@Injectable()
export class CommunityEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private communityService: CommunityService
  ) {}

  createCommunity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunityActions.createCommunity),
      mergeMap(({ request }) =>
        this.communityService
          .createCommunity(
            request.name,
            request.description,
            request.categories,
            request.image
          )
          .pipe(
            map((community) =>
              CommunityActions.createCommunitySuccess({ community })
            ),
            catchError((error) =>
              of(CommunityActions.createCommunityFailure({ error }))
            )
          )
      )
    )
  );

  createCommunitySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CommunityActions.createCommunitySuccess),
        tap(({ community }) => {
          this.router.navigate(['/community', community.id]);
        })
      ),
    { dispatch: false }
  );

  loadCommunities$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunityActions.loadCommunities),
      mergeMap(() =>
        this.communityService.getCommunities().pipe(
          map((communities) =>
            CommunityActions.loadCommunitiesSuccess({ communities })
          ),
          catchError((error) =>
            of(CommunityActions.loadCommunitiesFailure({ error }))
          )
        )
      )
    )
  );

  loadCommunity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunityActions.loadCommunity),
      switchMap(({ communityId }) =>
        this.communityService.getCommunity(communityId).pipe(
          map((community) =>
            CommunityActions.loadCommunitySuccess({ community })
          ),
          catchError((error) =>
            of(CommunityActions.loadCommunityFailure({ error }))
          )
        )
      )
    )
  );

  joinCommunity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunityActions.joinCommunity),
      exhaustMap(({ communityId }) =>
        this.communityService.joinCommunity(communityId).pipe(
          map((communityId) =>
            CommunityActions.joinCommunitySuccess(communityId)
          ),
          catchError((error) =>
            of(CommunityActions.joinCommunityFailure({ error }))
          )
        )
      )
    )
  );

  leaveCommunity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunityActions.leaveCommunity),
      exhaustMap(({ communityId }) =>
        this.communityService.leaveCommunity(communityId).pipe(
          map((success) => CommunityActions.leaveCommunitySuccess(success)),
          catchError((error) =>
            of(CommunityActions.leaveCommunityFailure(error))
          )
        )
      )
    )
  );
}
