import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/auth-state.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { filter, Observable, of, Subject, take, takeUntil, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/selectors/auth.selectors';
import { MatIconModule } from '@angular/material/icon';
import { FilePondModule } from 'ngx-filepond';

import { FilePondOptions, registerPlugin } from 'filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import { BrowserModule } from '@angular/platform-browser';
import { SettingsActions } from '../../../store/settings/settings.actions';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import { response } from 'express';
import { UserActions } from '../../../store/user/user.actions';
import { AuthActions } from '../../../store/auth/actions/auth.actions';
import {
  selectPhotoError,
  selectProfilePhotoUrl,
} from '../../../store/settings/settings.selectors';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop
);

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatIconModule,
    FilePondModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit, OnDestroy {
  faBell = faBell;
  notificationEnabled: boolean = true;
  @Input() inputName!: string;
  @Input() inputEmail!: string;
  @Input() inputPhone!: string;

  isEditing: boolean = false;
  userDetails$: Observable<User | null> = this.store.select(selectUser);
  profilePhotoUrl$: Observable<string | null> = this.store.select(
    selectProfilePhotoUrl
  );
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();

  /* Modal Setup */
  showModal = false;
  selectedFile: File | null = null;
  croppedImage: string | null = null;

  constructor(private store: Store) {
    this.profilePhotoUrl$ = this.store.select(selectProfilePhotoUrl);
    this.error$ = this.store.select(selectPhotoError);
  }

  private reloadPhoto() {
    this.userDetails$
      .pipe(
        takeUntil(this.destroy$),
        filter((user) => !!user),
        take(1)
      )
      .subscribe((user) => {
        this.store.dispatch(
          SettingsActions.getProfilePhoto({ userId: user.id })
        );
      });
  }

  ngOnInit() {
    this.userDetails$
      .pipe(
        takeUntil(this.destroy$),
        filter((user) => !!user),
        tap((user) => {
          this.store.dispatch(
            SettingsActions.getProfilePhoto({ userId: user.id })
          );
        })
      )
      .subscribe();

    this.reloadPhoto();
  }

  private getUserId(): string {
    let userId = '';
    this.userDetails$
      .pipe(
        take(1),
        filter((user) => !!user)
      )
      .subscribe((user) => (userId = user.id));
    return userId;
  }

  editProfile() {
    this.isEditing = true;
  }

  toggleEdit(field: any) {
    field.editing = !field.editing;
  }

  saveProfile() {}

  openPasswordModal(type: string) {
    // Modal logic
  }

  /* FilePond Configuration */
  processFunction = (
    fieldName: string,
    file: File,
    metadata: object,
    load: (uniqueFileId: string | undefined) => void,
    error: (errorMessage: string) => void,
    progress: (progress: number, loaded: number, total: number) => void,
    abort: () => void
  ) => {
    this.onFileAdded(file);
    load(file.name);
  };

  pondOptions: FilePondOptions = {
    name: 'file',
    instantUpload: true,
    allowMultiple: false,
    maxFiles: 1,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    allowImagePreview: true,
    allowImageCrop: true,
    imageCropAspectRatio: '1:1',
    stylePanelAspectRatio: '1',
    allowBrowse: true,
    allowDrop: true,
    allowPaste: true,
    labelIdle:
      'Drag & Drop your photo or <span class="filepond--label-action">Browse</span>',
    dropOnPage: true,
    dropOnElement: true,
    server: {
      process: {
        url: `http://localhost:3000/settings/profile-photo-upload`,
        method: 'POST',
        withCredentials: true,
        onload: (response): string | number => {
          const fileUrl = JSON.parse(response).fileUrl;
          const userId = this.getUserId();
          this.store.dispatch(
            SettingsActions.uploadProfilePhotoSuccess({ userId })
          );

          this.showModal = false;
          this.selectedFile = null;
          
          return `success  ${fileUrl}`;
        },
        onerror: (response) => {
          console.log('Upload failed', response);
        },
      },
    },
  };

  onFileAdded(file: File) {
    this.selectedFile = file;
  }

  onCloseModal() {
    this.showModal = false;
    this.selectedFile = null;
  }

  onOpenModal() {
    this.showModal = true;
  }

  onFileProcessed(file: File) {
    console.log('File Processed: ', file);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
