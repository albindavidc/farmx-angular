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

interface ProfileField {
  label: string;
  key: keyof User; // Ensures key matches User properties
  editing: boolean;
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatIconModule],
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

}
