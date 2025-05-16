import { Component } from '@angular/core';
import { AdminNavBarComponent } from '../../../shared/components/nav-bar/admin-nav-bar/admin-nav-bar.component';
import { SettingsComponent } from '../../../shared/components/settings/settings.component';

@Component({
  selector: 'app-admin-settings',
  imports: [SettingsComponent, AdminNavBarComponent],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent {

}
