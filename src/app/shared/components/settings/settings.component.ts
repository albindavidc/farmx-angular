import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/auth-state.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/selectors/auth.selectors';

interface ProfileField {
  label: string;
  key: keyof User; // Ensures key matches User properties
  editing: boolean;
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  faBell = faBell;
  notificationEnabled: boolean = true;
  @Input() inputName!: string;
  @Input() inputEmail!:string;
  @Input() inputPhone!: string;
  edit: boolean = false;




  userDetails: Observable<User|null> = this.store.select(selectUser)


  constructor(private store: Store){

  }

  ngOnInit() {
    // Print entire store state
    this.store.subscribe(state => console.log('Full Store State:', state));
    
    // Alternative for specific feature state
    this.store.select(state => state).subscribe(fullState => {
      console.log('Current Store:', JSON.stringify(fullState, null, 2));
    });
    this.loadPreferences();

  }

  user = {
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  };

  profileFields = [
    { label: 'Your name', key: 'name', editing: false },
    { label: 'Email', key: 'email', editing: false },
    { label: 'Phone', key: 'phone', editing: false },
  ];

  twoFactorEnabled = true;

  notificationSettings = [
    {
      name: 'Email Notifications',
      description: 'Receive updates via email',
      icon: 'fas fa-envelope',
      enabled: true,
    },
    {
      name: 'Push Notifications',
      description: 'Get alerts on your device',
      icon: 'fas fa-bell',
      enabled: true,
    },
    {
      name: 'SMS Alerts',
      description: 'Text message notifications',
      icon: 'fas fa-comment-alt',
      enabled: false,
    },
  ];

  themes = [
    { id: 'light', name: 'Light', primary: '#f9faef', secondary: '#476730' },
    { id: 'dark', name: 'Dark', primary: '#1a1c18', secondary: '#b8ccab' },
    { id: 'blue', name: 'Ocean', primary: '#f1f5fd', secondary: '#3a5ba9' },
  ];

  currentTheme = 'light';

  // ngOnInit() {
  //   // Load user preferences
  //   this.loadPreferences();
  // }

  toggleEdit(field: any) {
    field.editing = !field.editing;
  }

  saveProfile() {
    // Save logic here
    this.profileFields.forEach((f) => (f.editing = false));
    // Show success feedback
  }

  openPasswordModal(type: string) {
    // Modal logic
  }

  setTheme(themeId: string) {
    this.currentTheme = themeId;
    // Apply theme logic
  }

  private loadPreferences() {
    // Load from storage
  }
}
