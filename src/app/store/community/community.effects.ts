import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommunityService } from './community.service';
import { CommunityActions } from './community.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

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
}
