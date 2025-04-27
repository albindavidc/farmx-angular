import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAllCommunities,
  selectCommunityLoading,
  selectJoinedCommunity,
} from '../../../../store/community/community.selectors';
import { CommunityActions } from '../../../../store/community/community.actions';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
} from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import {
  selectIsAuthenticated,
  selectUser,
} from '../../../../store/auth/selectors/auth.selectors';

@Component({
  selector: 'app-communities-list',
  imports: [CommonModule, RouterLink, MatIconModule, MatProgressSpinner],
  templateUrl: './communities-list.component.html',
  styleUrl: './communities-list.component.scss',
})
export class CommunitiesListComponent implements OnInit {
  communities$ = this.store.select(selectAllCommunities);
  loading$ = this.store.select(selectCommunityLoading);
  isUserLoggedIn$: Observable<boolean>;
  userRole!: string;
  userDetails: Observable<string>;

  constructor(private store: Store) {
    this.isUserLoggedIn$ = this.store.select(selectIsAuthenticated);

    this.userDetails = this.store.select(selectUser).pipe(
      take(1),
      filter((user) => !!user),
      map((user) => user.role)
    );
  }

  ngOnInit(): void {
    this.store.dispatch(CommunityActions.loadCommunities());

    this.userDetails.subscribe((role) => {
      this.userRole = role;
    });
    console.log(this.userRole, 'this is the front the front-end');


    this.communities$.subscribe(communities => {
      console.log('Communities data:', communities);
    });
  }

  joinCommunity(communityId: string): void {
    this.store.dispatch(CommunityActions.joinCommunity({ communityId }));
  }

  leaveCommunity(communityId: string): void {
    this.store.dispatch(CommunityActions.leaveCommunity({ communityId }));
  }

  isCommunityJoined(): Observable<boolean> {
    return this.store.select(selectJoinedCommunity);
  }
}
