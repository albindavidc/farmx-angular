import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FarmerStatus, User } from '../../../../shared/models/user.model';
import { UserRole } from '../../../../shared/models/user-role';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-admin-user-management-model',
  imports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatSliderModule,
    MatSlideToggleModule,
  ],
  templateUrl: './admin-user-management-model.component.html',
  styleUrl: './admin-user-management-model.component.scss',
})
export class AdminUserManagementModelComponent implements OnInit {
  roles = Object.values(UserRole);
  farmerStatuses = Object.values(FarmerStatus);
  mode: 'view' | 'edit' | 'create';
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public dialogRef: MatDialogRef<AdminUserManagementModelComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { user: User; mode: 'view' | 'edit' | 'create' }
  ) {
    this.mode = data.mode;
  }

  ngOnInit(): void {
    if (this.data.user.role) {
      // this.data.user.role = this.data.user.role.toLowerCase()
    }
  }

  /* Chip Add & Remove Expertise */
  addExpertise(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && this.mode !== 'view') {
      if (!this.data.user.expertise) {
        this.data.user.expertise = [];
      }

      this.data.user.expertise.push(value);
    }

    event.chipInput!.clear();
  }
  removeExpertise(index: number): void {
    if (this.mode !== 'view' && this.data.user.expertise) {
      this.data.user.expertise.splice(index, 1);
    }
  }

  /* Chip Add & Remove Award */
  addAward(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && this.mode !== 'view') {
      if (!this.data.user.awards) {
        this.data.user.awards = [];
      }
      this.data.user.awards.push(value);
    }

    event.chipInput!.clear();
  }
  removeAward(index: number): void {
    if (this.mode !== 'view' && this.data.user.awards) {
      this.data.user.awards.splice(index, 1);
    }
  }
}
