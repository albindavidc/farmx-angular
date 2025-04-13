// fa-wrapper.component.ts
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-fa-wrapper',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
    <fa-icon [icon]="icon" [size]="size" [fixedWidth]="fixedWidth"></fa-icon>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class FaWrapperComponent {
  @Input() icon!: IconProp;
  @Input() size?: 'xs' | 'sm' | 'lg' | 'xl' | '2x' | '3x' | '10x';
  @Input() fixedWidth = false;
}
