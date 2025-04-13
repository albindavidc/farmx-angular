import { Component, inject, Input } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import { SvgIconComponent } from 'angular-svg-icon';
import { FaWrapperComponent } from './fa-wrapper.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [SvgIconComponent, FaWrapperComponent, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  @Input() route!: string;
  constructor(library: FaIconLibrary) {
    library.addIcons(faGear, faBell);
  }
}
