import { Component, inject, Input, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBell, faGear } from '@fortawesome/free-solid-svg-icons';
import { SvgIconComponent } from 'angular-svg-icon';
import { FaWrapperComponent } from './fa-wrapper.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  imports: [SvgIconComponent, FaWrapperComponent, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  @Input() route!: string;
  @Input() shareSelect: boolean = false;

  constructor(library: FaIconLibrary, private router: Router) {
    library.addIcons(faGear, faBell);
  }

  ngOnInit(): void {
    this.updateSelectState();
  }

  private updateSelectState() {
    this.shareSelect = this.router.url === this.route;
  }
}
