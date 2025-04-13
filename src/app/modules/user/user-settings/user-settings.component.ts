import { Component } from '@angular/core';
import { SettingsComponent } from '../../../shared/components/settings/settings.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { UserNavBarComponent } from '../../../shared/components/nav-bar/user-nav-bar/user-nav-bar.component';

@Component({
  selector: 'app-user-settings',
  imports: [SettingsComponent, UserNavBarComponent],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent {}
