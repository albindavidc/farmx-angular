import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/auth-state.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
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
export class SettingsComponent implements OnInit {
  faBell = faBell;
  notificationEnabled: boolean = true;
  @Input() inputName!: string;
  @Input() inputEmail!: string;
  @Input() inputPhone!: string;

  isEditing: boolean = false;
  userDetails: Observable<User | null> = this.store.select(selectUser);
  avatarUrl: string | null = null;

    /* Modal Setup */
    showModal = false;
    selectedFile: File | null = null;
    croppedImage: string | null = null;

  constructor(private store: Store) {}

  ngOnInit() {
    this.avatarUrl = this.getUserPhoto();
  }

  editProfile() {
    this.isEditing = true;
  }

  toggleEdit(field: any) {
    field.editing = !field.editing;
  }

  getUserPhoto(): string | null {
    return this.avatarUrl;
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

  pondOptions = {
    class: 'my-filepond',
    allowMultiple: false,
    maxFiles: 1,
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
    allowImagePreview: true,
    allowImageCrop: true,
    allowImageTransform: true,
    imageCropAspectRatio: '1:1',
    imageResizeTargetWidth: 500,
    imageResizeTargetHeight: 500,
    imageResizeMode: 'cover',
    allowWebcam: true,
    allowCamera: true,
    stylePanelAspectRatio: '1',
    allowBrowse: true,
    allowDrop: true,
    allowPaste: true,
    labelIdle:
      'Drag & Drop your photo or <span class="filepond--label-action">Browse</span>',
    dropOnPage: true,
    dropOnElement: true,
    server: {
      process: this.processFunction.bind(this),
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

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profilePhoto', this.selectedFile);
      this.store.dispatch(SettingsActions.uploadProfilePhoto({ formData }));
      this.onCloseModal();
    }
  }
}
