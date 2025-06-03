import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MessageInputComponent } from '../message-input/message-input.component';
import { MatButtonModule } from '@angular/material/button';
import { CreateCommunityComponent } from './create-community/create-community.component';
import { filter, map, Observable, of, take } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../store/auth/selectors/auth.selectors';
import { ofType } from '@ngrx/effects';
import { CommunitiesListComponent } from './communities-list/communities-list.component';
import { CommunityPageComponent } from './community-page/community-page.component';

@Component({
  selector: 'app-community',
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    CommunitiesListComponent,
    CommunityPageComponent,
],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent implements OnInit {
  communityList!: [];
  userRole!: string;
  userDetails: Observable<string>;

  constructor(private store: Store) {
    this.userDetails = this.store.select(selectUser).pipe(
      take(1),
      filter((user) => !!user),
      map((user) => user.role)
    );
  }

  ngOnInit(): void {
    this.userDetails.subscribe((role) => {
      this.userRole = role;
    });
    console.log(this.userRole, 'this is the front the front-end');
  }
}
