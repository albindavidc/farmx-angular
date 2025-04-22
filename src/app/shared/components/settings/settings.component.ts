import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { User } from '../../models/auth-state.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faL } from '@fortawesome/free-solid-svg-icons';
import {
  filter,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
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
import e, { response } from 'express';
import { UserActions } from '../../../store/user/user.actions';
import { AuthActions } from '../../../store/auth/actions/auth.actions';
import {
  selectChangePasswordState,
  selectisOldPasswordValid,
  selectPhotoError,
  selectProfileLoading,
  selectProfilePhotoUrl,
} from '../../../store/settings/settings.selectors';
import { Router, RouterModule } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';

registerPlugin(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop
);

@Component({
  selector: 'app-settings',
  imports: [
    FontAwesomeModule,
    MatIconModule,
    FilePondModule,
    RouterModule,

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
  loading$ = this.store.select(selectProfileLoading);
  userDetails$: Observable<User | null> = this.store.select(selectUser);
  profilePhotoUrl$: Observable<string | null> = this.store.select(
    selectProfilePhotoUrl
  );
  error$: Observable<string | null>;
  private destroy$ = new Subject<void>();
  profileForm: FormGroup;

  /* Modal Setup */
  showModal = false;
  selectedFile: File | null = null;
  croppedImage: string | null = null;

  /* Changing Password */
  oldPasswordForm: FormGroup;
  showOldPasswordForm: boolean = false;
  isChangingPassword: boolean = false;
  oldPasswordError$!: Observable<string | null>;
  oldPasswordLoading$!: Observable<string | null>;

  /* Create New Password */
  changePasswordForm: FormGroup;
  showChangePasswordForm: boolean = false;
  isValidAccount$: Observable<boolean> = of(false);
  isSuccessfullyChanged$: Observable<boolean>;

  /* Forgot Password */
  showForgotPasswordForm: boolean = false;
  forgotPasswordForm: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private actions$: Actions
  ) {
    this.profilePhotoUrl$ = this.store.select(selectProfilePhotoUrl);
    this.error$ = this.store.select(selectPhotoError);

    this.profileForm = this.fb.group({
      name: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }, Validators.email],
      phone: [
        { value: '', disabled: true },
        [Validators.pattern(/^[0-9]{10}$/)],
      ],
    });

    this.oldPasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
    });

    this.changePasswordForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });

    this.forgotPasswordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });

    this.isValidAccount$ = this.store.select(selectisOldPasswordValid);
    this.isSuccessfullyChanged$ = this.store.select(selectChangePasswordState);
  }

  /* Check Password */
  checkOldPassword() {
    if (this.oldPasswordForm.valid) {
      this.store.dispatch(
        SettingsActions.validateOldPassword({
          oldPassword: this.oldPasswordForm.get('oldPassword')?.value,
        })
      );
    }

    this.isValidAccount$.pipe(take(1)).subscribe((isValid) => {
      if (isValid) {
        this.showOldPasswordForm = false;
        this.showChangePasswordForm = true;
        this.isChangingPassword = true;
      }
    });
  }

  changePassword() {
    if (this.changePasswordForm.valid) {
      this.store.dispatch(
        SettingsActions.changePassword({
          newPassword: this.changePasswordForm.get('newPassword')?.value,
          confirmPassword:
            this.changePasswordForm.get('confirmPassword')?.value,
        })
      );
    }

    this.actions$
      .pipe(ofType(SettingsActions.changePasswordSuccess), take(1))
      .subscribe(() => {
        this.showChangePasswordForm = false;
        this.isChangingPassword = false;
      });
  }

  toggleOldPasswordForm() {
    this.showOldPasswordForm = true;
    this.showChangePasswordForm = false;
    this.isChangingPassword = true;
  }

  /* Forgot Password */
  forgotPasswordGenerateOtp() {
    this.userDetails$
      .pipe(
        take(1),
        filter((user) => !!user),
        switchMap((user) => {
          this.store.dispatch(
            SettingsActions.forgotPasswordGenerateOtp({ email: user.email })
          );
          return this.actions$.pipe(
            ofType(SettingsActions.forgotPasswordGenerateOtpSuccess),
            take(1)
          );
        })
      )
      .subscribe(() => {
        this.showForgotPasswordForm = true;
        this.isChangingPassword = true;
      });
  }

  resendOtp() {
    this.userDetails$
      .pipe(
        take(1),
        filter((user) => !!user),
        switchMap((user) => {
          this.store.dispatch(
            SettingsActions.forgotPasswordResendOtp({ email: user.email })
          );
          return this.actions$.pipe(
            ofType(SettingsActions.forgotPasswordResendOtpSuccess),
            take(1)
          );
        })
      )
      .subscribe();
  }

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.userDetails$
        .pipe(
          take(1),
          filter((user) => !!user),
          switchMap((user) => {
            this.store.dispatch(
              SettingsActions.forgotPasswordValidateOtp({
                email: user.email,
                otp: this.forgotPasswordForm.value.otp,
              })
            );
            return this.actions$.pipe(
              ofType(SettingsActions.forgotPasswordValidateOtpSuccess),
              take(1)
            );
          })
        )
        .subscribe(() => {
          this.showForgotPasswordForm = false;
          this.showChangePasswordForm = true;
          this.isChangingPassword = true;
        });
    } else {
      console.log('form is not valid');
    }
  }

  /* Navigate back */
  navigateBack() {
    this.showOldPasswordForm = false;
    this.showChangePasswordForm = false;
    this.showForgotPasswordForm = false;
    this.isChangingPassword = false;
  }

  /* Profile Section */
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

    this.userDetails$
      .pipe(
        takeUntil(this.destroy$),
        filter((user) => !!user)
      )
      .subscribe((user) => {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      });
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
    if (this.isEditing === true) {
      this.profileForm.enable();
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing === true) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.store.dispatch(
        SettingsActions.updateProfile({
          updates: this.profileForm.value,
        })
      );
    }
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

  /* Destroying sessions */
  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
