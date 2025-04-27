import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAllCommunities,
  selectCommunityLoading,
  selectJoinedCommunity,
} from '../../../../../store/community/community.selectors';
import { CommunityActions } from '../../../../../store/community/community.actions';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-communities-list',
  imports: [
    CommonModule,
    RouterLink,

    MatIconModule,
    MatProgressSpinner,

    MatCard,
    MatCardContent,
    MatCardActions,

  ],
  templateUrl: './communities-list.component.html',
  styleUrl: './communities-list.component.scss',
})
export class CommunitiesListComponent implements OnInit {
  communities$ = this.store.select(selectAllCommunities);
  loading$ = this.store.select(selectCommunityLoading);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(CommunityActions.loadCommunities());
  }

  joinCommunity(communityId: string): void {
    this.store.dispatch(CommunityActions.joinCommunity({ communityId }));
  }

  leaveCommunity(communityId: string): void {
    this.store.dispatch(CommunityActions.leaveCommunity({ communityId }));
  }

  isCommunityJoined(): Observable<boolean>{
    return this.store.select(selectJoinedCommunity)
  }
}
