import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CommunityPostService } from './community-post.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { CommunityPostActions } from './community-post.actions';

@Injectable()
export class CommunityPostEffects {
  constructor(
    private actions$: Actions,
    private postService: CommunityPostService,
    private snackBar: MatSnackBar
  ) {}

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunityPostActions.loadPosts),
      tap(action => console.log('Loading posts for community:', action.communityId)),

      switchMap(({ communityId }) =>
        this.postService.getPosts(communityId).pipe(
          tap(posts => console.log('Posts received from API:', posts)),

          map((posts) => CommunityPostActions.loadPostsSuccess({ posts })),
          catchError((error) => of(CommunityPostActions.loadPostsFailure({ error })))
        )
      )
    )
  );

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunityPostActions.createPost),
      switchMap(({ text, image, communityId }) =>
        this.postService.createPost(text, communityId, image).pipe(
          map((post) => CommunityPostActions.createPostSuccess({ post })),
          catchError((error) => of(CommunityPostActions.createPostFailure({ error })))
        )
      )
    )
  );

  editPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunityPostActions.editPost),
      switchMap(({ postId, text, image }) =>
        this.postService.editPost(postId, text, image).pipe(
          map((post) => CommunityPostActions.editPostSuccess({ post })),
          catchError((error) => of(CommunityPostActions.editPostFailure({ error })))
        )
      )
    )
  );

  deletePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommunityPostActions.deletePost),
      switchMap(({ postId }) =>
        this.postService.deletePost(postId).pipe(
          map(() => CommunityPostActions.deletePostSuccess({ postId })),
          catchError((error) => of(CommunityPostActions.deletePostFailure({ error })))
        )
      )
    )
  );

  postSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CommunityPostActions.createPostSuccess,
          CommunityPostActions.editPostSuccess,
          CommunityPostActions.deletePostSuccess
        ),
        tap((action) => {
          let message = '';

          if (action.type === '[CommunityPost] Create Post Success') {
            message = 'Post created successfully!';
          } else if (action.type === '[CommunityPost] Edit Post Success') {
            message = 'Post updated successfully!';
          } else if (action.type === '[CommunityPost] Delete Post Success') {
            message = 'Post deleted successfully!';
          }

          this.snackBar.open(message, 'Close', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        })
      ),
    { dispatch: false }
  );

  postError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CommunityPostActions.createPostFailure,
          CommunityPostActions.editPostFailure,
          CommunityPostActions.deletePostFailure,
          CommunityPostActions.loadPostsFailure
        ),
        tap((action) => {
          let message = 'An error occurred';

          if (action.error?.message) {
            message = action.error.message;
          }

          this.snackBar.open(message, 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'],
          });
        })
      ),
    { dispatch: false }
  );
}
