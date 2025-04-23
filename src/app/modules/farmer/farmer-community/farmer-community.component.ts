import { Component } from '@angular/core';
import { FarmerNavBarComponent } from '../../../shared/components/nav-bar/farmer-nav-bar/farmer-nav-bar.component';
import { CommunityComponent } from '../../../shared/components/community/community.component';

@Component({
  selector: 'app-farmer-community',
  imports: [FarmerNavBarComponent, CommunityComponent],
  templateUrl: './farmer-community.component.html',
  styleUrl: './farmer-community.component.scss'
})
export class FarmerCommunityComponent {

}
