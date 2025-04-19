import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { response } from 'express';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { SettingsActions } from './settings.actions';
import { SettingsService } from './settings.service';
import { error, profile } from 'console';

@Injectable()
export class SettingsEffects {
  settingsService = inject(SettingsService);

  constructor(private actions$: Actions, private http: HttpClient) {}

  /* Profile Section */
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

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.updateProfile),
      exhaustMap(({ updates }) =>
        this.settingsService.updateProfile(updates).pipe(
          map((profile) => SettingsActions.updateProfileSuccess({ profile })),
          catchError((error) =>
            of(SettingsActions.updateProfileFailure({ error: error.message }))
          )
        )
      )
    )
  );

  /* Security Section */
  validateOldPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SettingsActions.validateOldPassword),
      switchMap((action) =>
        this.settingsService.validateOldPassword(action.oldPassword).pipe(
          map((response) =>
            response.success
              ? SettingsActions.validateOldPasswordSuccess({ isValid: true })
              : SettingsActions.validateOldPasswordFailure({
                  error: response.error || 'Invalid password',
                })
          ),
          catchError((error) =>
            of(
              SettingsActions.validateOldPasswordFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );
}
