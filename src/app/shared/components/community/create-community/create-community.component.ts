import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Store } from '@ngrx/store';
import { CommunityActions } from '../../../../store/community/community.actions';
import { Router } from '@angular/router';
import { createCommunityRequest } from '../../../models/community.model';
import { FarmerNavBarComponent } from '../../nav-bar/farmer-nav-bar/farmer-nav-bar.component';

@Component({
  selector: 'app-create-community',
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatCardModule,
    MatIconModule,
    MatButtonModule,

    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    FarmerNavBarComponent
  ],
  templateUrl: './create-community.component.html',
  styleUrl: './create-community.component.scss',
})
export class CreateCommunityComponent {
  createCommunityForm: FormGroup;
  selectImage: File | null = null;
  imagePreview: string | null = null;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {
    this.createCommunityForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(500),
        ],
      ],
      categories: [[] as string[]],
    });
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      this.selectImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectImage = null;
    this.imagePreview = null;
  }

  addCategory(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const currentCategory = this.createCommunityForm.get('categories')
        ?.value as string[];
      if (!currentCategory.includes(value)) {
        this.createCommunityForm
          .get('categories')
          ?.setValue([...currentCategory, value]);
      }
    }

    event.chipInput!.clear();
  }

  removeCategory(category: string) {
    const currentCategories = this.createCommunityForm.get('categories')
      ?.value as string[];
    const index = currentCategories.indexOf(category);

    if (index >= 0) {
      let updated = [...currentCategories];
      updated.splice(index, 1);
      this.createCommunityForm.get('categories')?.setValue(updated);
    }
  }

  submitForm(): void {
    if (this.createCommunityForm.valid) {
      const { name, description, categories } = this.createCommunityForm.value;

      const request: createCommunityRequest = {
        name,
        description,
        categories,
        image: this.selectImage || undefined,
      };
      this.store.dispatch(CommunityActions.createCommunity({ request }));

      this.router.navigate(['/community']);
    }
  }
}
