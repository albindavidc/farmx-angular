import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilePondModule } from 'ngx-filepond';
import * as FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import * as FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import * as FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import * as FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import * as FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { FilePondOptions } from 'filepond';
import { environment } from '../../../../environments/environment.development';

export interface DialogData {
  mode: 'create' | 'edit';
  item?: {
    id?: string;
    name?: string;
    description?: string;
    creationDate?: Date;
    memberCount?: number;
    isActive?: boolean;
    image?: string;
  };
}

@Component({
  selector: 'app-admin-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FilePondModule,
  ],
  templateUrl: './admin-dialog.component.html',
  styleUrl: './admin-dialog.component.scss',
})
export class AdminDialogComponent implements OnInit {
  @ViewChild('filePond') filePond: any;
  
  form!: FormGroup;
  dialogTitle: string;
  maxDate: Date = new Date();
  uploadedImageUrl: string | null = null;
  isSubmitting = false;
  isUploadingImage = false;

  pondFiles: any[] = [];
  pondOptions: FilePondOptions = {
    className: 'filepond-custom',
    labelIdle:
      'Drag & Drop your image or <span class="filepond--label-action">Browse</span>',
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFileSize: '5MB',
    maxFiles: 1,
    allowMultiple: false,
    instantUpload: true,
    allowImagePreview: true,
    allowImageCrop: true,
    imageCropAspectRatio: '1:1',
    imagePreviewHeight: 200,
    stylePanelAspectRatio: '1',
    credits: false,
    server: {
      process: {
        url: `${environment.apiURL}/community/upload-image`,
        method: 'POST',
        withCredentials: true,
        headers: {
          // Add any required headers here
          // 'Authorization': `Bearer ${token}` if needed
        },
        onload: (response: string): string => {
          try {
            const parsedResponse = JSON.parse(response);
            const imageUrl = parsedResponse.fileUrl || parsedResponse.url || parsedResponse.imageUrl;
            
            if (imageUrl) {
              this.uploadedImageUrl = imageUrl;
              this.form.patchValue({ image: imageUrl });
              this.snackBar.open('Image uploaded successfully!', 'Close', {
                duration: 3000,
                horizontalPosition: 'end',
                verticalPosition: 'top',
                panelClass: ['success-snackbar']
              });
              return imageUrl;
            } else {
              throw new Error('No image URL in response');
            }
          } catch (error) {
            console.error('Upload response parse error:', error);
            this.snackBar.open('Upload failed: Invalid response', 'Close', {
              duration: 5000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
            return 'error';
          }
        },
        onerror: (response: string): void => {
          console.error('Upload failed:', response);
          this.uploadedImageUrl = null;
          this.snackBar.open('Image upload failed. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        },
        ondata: (formData: FormData): FormData => {
          // You can modify the form data here if needed
          // For example, add additional fields
          // formData.append('type', 'community');
          return formData;
        },
      },
      revert: null, // Disable revert if not needed
      restore: null,
      load: null,
      fetch: null,
    },
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdminDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogTitle =
      data.mode === 'create' ? 'Create New Community' : 'Edit Community';
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadExistingImage();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: [
        this.data.item?.name || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          this.noWhitespaceValidator,
        ],
      ],
      description: [
        this.data.item?.description || '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
          this.noWhitespaceValidator,
        ],
      ],
      creationDate: [
        this.data.item?.creationDate || new Date(),
        [Validators.required, this.dateNotInFutureValidator],
      ],
      memberCount: [
        this.data.item?.memberCount || 0,
        [Validators.required, Validators.min(0), Validators.max(1000000)],
      ],
      isActive: [
        this.data.item?.isActive !== undefined ? this.data.item.isActive : true,
      ],
      image: [this.data.item?.image || '', [this.urlValidator]],
    });
  }

  private loadExistingImage(): void {
    if (this.data.item?.image) {
      this.uploadedImageUrl = this.data.item.image;
      // If you want to display the existing image in FilePond, you can add it to pondFiles
      this.pondFiles = [
        {
          source: this.data.item.image,
          options: {
            type: 'local',
          },
        },
      ];
    }
  }

  // Custom Validators
  private noWhitespaceValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace && control.value ? { whitespace: true } : null;
  }

  private dateNotInFutureValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selectedDate > today ? { futureDate: true } : null;
  }

  private urlValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const isValid = urlPattern.test(control.value);
    
    return isValid ? null : { invalidUrl: true };
  }

  // FilePond Methods
  pondHandleInit(): void {
    console.log('FilePond has initialized');
  }

  pondHandleAddFile(event: any): void {
    console.log('File added', event);
    this.isUploadingImage = true;
  }

  pondHandleProcessFile(event: any): void {
    console.log('File processed', event);
    this.isUploadingImage = false;
    if (event.file && event.file.serverId) {
      this.uploadedImageUrl = event.file.serverId;
      this.form.patchValue({ image: this.uploadedImageUrl });
    }
  }

  pondHandleRemoveFile(event: any): void {
    console.log('File removed', event);
    this.uploadedImageUrl = null;
    this.form.patchValue({ image: '' });
    this.isUploadingImage = false;
  }

  pondHandleError(event: any): void {
    console.error('FilePond error:', event);
    this.isUploadingImage = false;
    this.snackBar.open('Image upload failed. Please try again.', 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  // Form Control Getters for Template
  get nameControl(): AbstractControl | null {
    return this.form.get('name');
  }

  get descriptionControl(): AbstractControl | null {
    return this.form.get('description');
  }

  get creationDateControl(): AbstractControl | null {
    return this.form.get('creationDate');
  }

  get memberCountControl(): AbstractControl | null {
    return this.form.get('memberCount');
  }

  get imageControl(): AbstractControl | null {
    return this.form.get('image');
  }

  // Error Message Getters
  getNameErrorMessage(): string {
    const control = this.nameControl;
    if (control?.hasError('required')) {
      return 'Community name is required';
    }
    if (control?.hasError('minlength')) {
      return 'Name must be at least 3 characters long';
    }
    if (control?.hasError('maxlength')) {
      return 'Name cannot exceed 100 characters';
    }
    if (control?.hasError('whitespace')) {
      return 'Name cannot be only whitespace';
    }
    return '';
  }

  getDescriptionErrorMessage(): string {
    const control = this.descriptionControl;
    if (control?.hasError('required')) {
      return 'Description is required';
    }
    if (control?.hasError('minlength')) {
      return 'Description must be at least 10 characters long';
    }
    if (control?.hasError('maxlength')) {
      return 'Description cannot exceed 500 characters';
    }
    if (control?.hasError('whitespace')) {
      return 'Description cannot be only whitespace';
    }
    return '';
  }

  getCreationDateErrorMessage(): string {
    const control = this.creationDateControl;
    if (control?.hasError('required')) {
      return 'Creation date is required';
    }
    if (control?.hasError('futureDate')) {
      return 'Date cannot be in the future';
    }
    return '';
  }

  getMemberCountErrorMessage(): string {
    const control = this.memberCountControl;
    if (control?.hasError('required')) {
      return 'Member count is required';
    }
    if (control?.hasError('min')) {
      return 'Member count cannot be negative';
    }
    if (control?.hasError('max')) {
      return 'Member count cannot exceed 1,000,000';
    }
    return '';
  }

  getImageErrorMessage(): string {
    const control = this.imageControl;
    if (control?.hasError('invalidUrl')) {
      return 'Please enter a valid URL';
    }
    return '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      this.snackBar.open('Please fix all errors before submitting', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
      return;
    }

    if (this.isUploadingImage) {
      this.snackBar.open('Please wait for image upload to complete', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar']
      });
      return;
    }

    this.isSubmitting = true;
    const formData = { ...this.form.value };

    // If editing, preserve the original ID
    if (this.data.mode === 'edit' && this.data.item?.id) {
      formData.id = this.data.item.id;
    }

    // Ensure image URL is included
    if (this.uploadedImageUrl) {
      formData.image = this.uploadedImageUrl;
    }

    // Simulate API call delay (remove this in production if you handle it elsewhere)
    setTimeout(() => {
      this.isSubmitting = false;
      this.dialogRef.close(formData);
    }, 500);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Accessibility helpers
  getAriaLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Community name input field',
      description: 'Community description textarea',
      memberCount: 'Member count number input',
      creationDate: 'Creation date picker',
      image: 'Image URL input field',
      isActive: 'Active community checkbox',
    };
    return labels[fieldName] || fieldName;
  }

  // Image error handler
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }
}