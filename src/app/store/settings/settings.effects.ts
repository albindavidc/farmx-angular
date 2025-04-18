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
            action.formData
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
}
