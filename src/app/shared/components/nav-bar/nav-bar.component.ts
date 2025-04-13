import { Component } from '@angular/core';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import { SvgIconComponent } from 'angular-svg-icon';
import { FaWrapperComponent } from './fa-wrapper.component';

@Component({
  selector: 'app-nav-bar',
  imports: [SvgIconComponent, FaWrapperComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent {
  constructor(library: FaIconLibrary) {
    library.addIcons(faGear, faBell);
  }
}
