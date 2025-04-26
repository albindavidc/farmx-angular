import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MessageInputComponent } from '../message-input/message-input.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-community',
  imports: [CommonModule, MatIcon, MessageInputComponent, MatButtonModule],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent {
  communityList!: [];
}
