import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';

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
  ],
  templateUrl: './create-community.component.html',
  styleUrl: './create-community.component.scss',
})
export class CreateCommunityComponent {
  createCommunityForm!: FormGroup;

  submitForm(){

  }

  addCategory(event: EventListener){

  }

  removeCategory(category: string){

  }
}
