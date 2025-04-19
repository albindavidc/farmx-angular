import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { response } from 'express';
import { catchError, exhaustMap, map, of } from 'rxjs';
import { SettingsActions } from './settings.actions';

@Injectable()
export class SettingsEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  uploadProfilePhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.uploadProfilePhoto),
      exhaustMap((action) =>
        this.http
          .post<{ photoUrl: string }>(
            'http://localhost:3000/settings/profile-photo-upload',
            action.formData,
            { withCredentials: true }
          )
          .pipe(
            map((response) => ({
              type: `[Profile] Upload Profile Photo Success`,
              response,
            })),
            catchError((error) =>
              of(
                SettingsActions.uploadProfilePhotoFailure({
                  error: error.message,
                })
              )
            )
          )
      )
    )
  );

  getProfilePhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.getProfilePhoto),
      exhaustMap((action) =>
        this.http
          .get('http://localhost:3000/settings/get-profile-photo', {
            responseType: 'blob',
            withCredentials: true,
          })
          .pipe(
            map((response) => {
              const url = URL.createObjectURL(response);
              return SettingsActions.getProfilePhotoSuccess({ photoUrl: url });
            }),
            catchError((error) =>
              of(
                SettingsActions.getProfilePhotoFailure({ error: error.message })
              )
            )
          )
      )
    )
  );

  autoReloadAfterUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.uploadProfilePhotoSuccess),
      map(({ userId }) => SettingsActions.getProfilePhoto({ userId }))
    )
  );
}
