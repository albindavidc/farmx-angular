import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar.component';
import { MenuItems } from '../../../models/menu-item.model';

@Component({
  selector: 'app-user-nav-bar',
  imports: [NavBarComponent],
  templateUrl: './user-nav-bar.component.html',
  styleUrl: './user-nav-bar.component.scss',
})
export class UserNavBarComponent {
  menuItems: MenuItems[] = [
    { icon: 'chat', label: 'Chat', selectEl: true, route: '/settings/chat' },
  ];
}
