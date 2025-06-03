import { Component } from '@angular/core';
import { UserNavBarComponent } from "../../../shared/components/nav-bar/user-nav-bar/user-nav-bar.component";
import { CommunityComponent } from "../../../shared/components/community/community.component";

@Component({
  selector: 'app-user-community',
  imports: [UserNavBarComponent, CommunityComponent],
  templateUrl: './user-community.component.html',
  styleUrl: './user-community.component.scss'
})
export class UserCommunityComponent {

}
