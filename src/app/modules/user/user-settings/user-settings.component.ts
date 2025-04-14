import { Component } from '@angular/core';
import { SettingsComponent } from '../../../shared/components/settings/settings.component';
import { NavBarComponent } from '../../../shared/components/nav-bar/nav-bar.component';
import { UserNavBarComponent } from '../../../shared/components/nav-bar/user-nav-bar/user-nav-bar.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/selectors/auth.selectors';
import { User } from '../../../shared/models/auth-state.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-settings',
  imports: [SettingsComponent, UserNavBarComponent, CommonModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
})
export class UserSettingsComponent {
  userDetails: Observable<User | null> = this.store.select(selectUser);

  constructor(private store: Store) {}
}
