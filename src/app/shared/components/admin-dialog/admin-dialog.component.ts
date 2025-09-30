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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilePondModule } from 'ngx-filepond';
import { FilePondOptions } from 'filepond';
import { environment } from '../../../../environments/environment.development';
import { CommunityService } from '../../services/admin/community.service';
import {
  MatChipListbox,
  MatChipOption,
  MatChipRemove,
} from '@angular/material/chips';

export interface DialogData {
  mode: 'create' | 'edit';
  item?: {
    id?: string;
    name?: string;
    description?: string;
    isActive?: boolean;
    imageUrl?: string;
    categories?: string[];
    membersCount?: number;
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
    MatTooltipModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FilePondModule,
    MatChipListbox,
    MatChipOption,
    MatChipRemove,
  ],
  templateUrl: './admin-dialog.component.html',
  styleUrl: './admin-dialog.component.scss',
})
export class AdminDialogComponent implements OnInit {
  @ViewChild('filePond') filePond: any;

  form!: FormGroup;
  dialogTitle: string;
  uploadedImageUrl: string | null = null;
  isSubmitting = false;
  isUploadingImage = false;
  categories: string[] = [];

  pondFiles: any[] = [];
  pondOptions: FilePondOptions = {
    name: 'file',
    className: 'filepond-custom',
    labelIdle:
      'Drag & Drop your image or <span class="filepond--label-action">Browse</span>',
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
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
        onload: (response: string): string => {
          try {
            const parsedResponse = JSON.parse(response);
            const imageUrl =
              parsedResponse.fileUrl ||
              parsedResponse.url ||
              parsedResponse.imageUrl;
            if (imageUrl) {
              this.uploadedImageUrl = imageUrl;
              this.form.patchValue({ imageUrl });
              this.snackBar.open('Image uploaded successfully!', 'Close', {
                duration: 3000,
                panelClass: ['success-snackbar'],
              });
              return imageUrl;
            } else {
              throw new Error('No image URL in response');
            }
          } catch (error) {
            this.snackBar.open('Upload failed: Invalid response', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
            return 'error';
          }
        },
        onerror: (): void => {
          this.uploadedImageUrl = null;
          this.snackBar.open(
            'Image upload failed. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      },
      revert: null,
      restore: null,
      load: null,
      fetch: null,
    },
  };

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdminDialogComponent>,
    private snackBar: MatSnackBar,
    private communityService: CommunityService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogTitle =
      data.mode === 'create' ? 'Create New Community' : 'Edit Community';
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadExistingImage();
    if (this.data.item?.categories) {
      this.categories = [...this.data.item.categories];
    }
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
      isActive: [
        this.data.item?.isActive !== undefined ? this.data.item.isActive : true,
      ],
      imageUrl: [this.data.item?.imageUrl || ''],
      categories: [this.data.item?.categories || []],
      categoryInput: [''],
    });
  }

  private loadExistingImage(): void {
    if (this.data.item?.imageUrl) {
      this.uploadedImageUrl = this.data.item.imageUrl;
      this.pondFiles = [
        {
          source: this.data.item.imageUrl,
          options: { type: 'local' },
        },
      ];
    }
  }

  private noWhitespaceValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace && control.value ? { whitespace: true } : null;
  }

  addCategory(): void {
    const input = this.form.get('categoryInput');
    const value = input?.value?.trim();

    if (value && !this.categories.includes(value)) {
      this.categories.push(value);
      this.form.patchValue({ categories: this.categories });
      input?.setValue('');
    } else if (this.categories.includes(value)) {
      this.snackBar.open('Category already added', 'Close', { duration: 2000 });
    }
  }

  removeCategory(category: string): void {
    const index = this.categories.indexOf(category);
    if (index >= 0) {
      this.categories.splice(index, 1);
      this.form.patchValue({ categories: this.categories });
    }
  }

  pondHandleInit(): void {
    console.log('FilePond initialized');
  }

  pondHandleAddFile(): void {
    this.isUploadingImage = true;
  }

  pondHandleProcessFile(event: any): void {
    this.isUploadingImage = false;
    if (event.file?.serverId) {
      this.uploadedImageUrl = event.file.serverId;
      this.form.patchValue({ imageUrl: this.uploadedImageUrl });
    }
  }

  pondHandleRemoveFile(): void {
    this.uploadedImageUrl = null;
    this.form.patchValue({ imageUrl: '' });
    this.isUploadingImage = false;
  }

  pondHandleError(): void {
    this.isUploadingImage = false;
    this.snackBar.open('Image upload failed. Please try again.', 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  get nameControl() {
    return this.form.get('name');
  }
  get descriptionControl() {
    return this.form.get('description');
  }
  get imageUrlControl() {
    return this.form.get('imageUrl');
  }
  get categoryInputControl() {
    return this.form.get('categoryInput');
  }

  getNameErrorMessage(): string {
    const c = this.nameControl;
    if (c?.hasError('required')) return 'Community name is required';
    if (c?.hasError('minlength')) return 'Name must be at least 3 characters';
    if (c?.hasError('maxlength')) return 'Name cannot exceed 100 characters';
    if (c?.hasError('whitespace')) return 'Name cannot be only whitespace';
    return '';
  }

  getDescriptionErrorMessage(): string {
    const c = this.descriptionControl;
    if (c?.hasError('required')) return 'Description is required';
    if (c?.hasError('minlength'))
      return 'Description must be at least 10 characters';
    if (c?.hasError('maxlength'))
      return 'Description cannot exceed 500 characters';
    if (c?.hasError('whitespace'))
      return 'Description cannot be only whitespace';
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
        panelClass: ['warning-snackbar'],
      });
      return;
    }

    if (this.isUploadingImage) {
      this.snackBar.open('Please wait for image upload to complete', 'Close', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['warning-snackbar'],
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
    const request$ = this.communityService.createCommunity(formData);

    request$.subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.snackBar.open(
          this.data.mode === 'edit'
            ? 'Community updated successfully'
            : 'Community created successfully',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          }
        );
        this.dialogRef.close(res); // return API response to parent
      },
      error: (err) => {
        this.isSubmitting = false;
        this.snackBar.open(
          err?.message || 'Failed to save community. Please try again.',
          'Close',
          {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          }
        );
      },
    });
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

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) target.style.display = 'none';
  }
}
