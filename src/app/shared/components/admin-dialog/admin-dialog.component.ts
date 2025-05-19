import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
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

export interface DialogData {
  mode: 'create' | 'edit';
  item: any;
}

@Component({
  selector: 'app-admin-dialog',
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
  ],
  templateUrl: './admin-dialog.component.html',
  styleUrl: './admin-dialog.component.scss',
})
export class AdminDialogComponent {
  form: FormGroup;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.dialogTitle =
      data.mode === 'create' ? 'Create New Community' : 'Edit Community';

    // Initialize the form with community data
    this.form = this.fb.group({
      name: [data.item?.name || '', [Validators.required]],
      description: [data.item?.description || '', [Validators.required]],
      creationDate: [data.item?.creationDate || new Date()],
      memberCount: [data.item?.memberCount || 0],
      isActive: [data.item?.isActive !== undefined ? data.item.isActive : true],
      image: [data.item?.image || ''],
    });
  }

  ngOnInit(): void {
    // Additional initialization logic if needed
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;

      // If editing, preserve the original ID
      if (this.data.mode === 'edit' && this.data.item._id) {
        formData._id = this.data.item._id;
      }

      this.dialogRef.close(formData);
    } else {
      // Mark form controls as touched to display validation errors
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
    }
  }
}
