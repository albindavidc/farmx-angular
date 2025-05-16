import { Component } from '@angular/core';
import { MenuItems } from '../../../models/menu-item.model';
import { NavBarComponent } from '../nav-bar.component';

@Component({
  selector: 'app-admin-nav-bar',
  imports: [NavBarComponent],
  templateUrl: './admin-nav-bar.component.html',
  styleUrl: './admin-nav-bar.component.scss',
})
export class AdminNavBarComponent {
  menuItems: MenuItems[] = [
    {
      icon: 'group',
      label: 'Community',
      selectEl: true,
      route: '/admin/community',
    },
  ];
}
