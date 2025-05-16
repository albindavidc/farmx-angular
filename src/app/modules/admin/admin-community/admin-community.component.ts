import { Component } from '@angular/core';
import { CommunityComponent } from '../../../shared/components/community/community.component';
import { AdminNavBarComponent } from '../../../shared/components/nav-bar/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-admin-community',
  imports: [CommunityComponent, AdminNavBarComponent],
  templateUrl: './admin-community.component.html',
  styleUrl: './admin-community.component.scss'
})
export class AdminCommunityComponent {

}
