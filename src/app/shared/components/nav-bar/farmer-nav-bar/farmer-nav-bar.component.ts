import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar.component';
import { MenuItems } from '../../../models/menu-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-farmer-nav-bar',
  imports: [NavBarComponent, CommonModule],
  templateUrl: './farmer-nav-bar.component.html',
  styleUrl: './farmer-nav-bar.component.scss',
})
export class FarmerNavBarComponent {
  menuItems: MenuItems[] = [
    {
      icon: 'group',
      label: 'Community',
      selectEl: true,
      route: '/farmer/community',
    },
  ];
}
