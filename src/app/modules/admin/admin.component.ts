import { Component } from '@angular/core';
import { AdminNavBarComponent } from '../../shared/components/nav-bar/admin-nav-bar/admin-nav-bar.component';

@Component({
  selector: 'app-admin',
  imports: [AdminNavBarComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {}
