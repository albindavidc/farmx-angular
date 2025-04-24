import { Component, Input, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import { SvgIconComponent } from 'angular-svg-icon';
import { FaWrapperComponent } from './fa-wrapper.component';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuItems } from '../../models/menu-item.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [SvgIconComponent, FaWrapperComponent, RouterLink, MatIconModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  @Input() menuItems: MenuItems[] = [];
  @Input() settingsRoute!: string;
  @Input() selectEl: boolean = false;

  isMenuOpen: boolean = false;

  constructor(library: FaIconLibrary, private router: Router) {
    library.addIcons(faGear, faBell);
  }

  ngOnInit(): void {
    this.updateSelectState();

    console.log('navbar menus', this.menuItems)
  }

  private updateSelectState() {
    this.selectEl = this.router.url === this.settingsRoute;

    this.menuItems.forEach((item) => {
      item.selectEl = this.router.url === item.route;
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
