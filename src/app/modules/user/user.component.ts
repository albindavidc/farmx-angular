import { Component } from '@angular/core';
import { UserNavBarComponent } from '../../shared/components/nav-bar/user-nav-bar/user-nav-bar.component';

@Component({
  selector: 'app-user',
  imports: [UserNavBarComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

}
