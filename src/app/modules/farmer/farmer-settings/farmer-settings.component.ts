import { Component } from '@angular/core';
import { FarmerNavBarComponent } from '../../../shared/components/nav-bar/farmer-nav-bar/farmer-nav-bar.component';
import { UserSettingsComponent } from '../../user/user-settings/user-settings.component';
import { SettingsComponent } from '../../../shared/components/settings/settings.component';

@Component({
  selector: 'app-farmer-settings',
  imports: [FarmerNavBarComponent, SettingsComponent],
  templateUrl: './farmer-settings.component.html',
  styleUrl: './farmer-settings.component.scss'
})
export class FarmerSettingsComponent {

}
