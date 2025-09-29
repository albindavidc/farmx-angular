import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  take,
} from 'rxjs';
import {
  selectIsAuthenticated,
  selectUser,
} from '../../../../store/auth/selectors/auth.selectors';
import { CommunityActions } from '../../../../store/community/community.actions';
import {
  selectAllCommunities,
  selectCommunityLoading,
  selectJoinedCommunity,
} from '../../../../store/community/community.selectors';
import { User } from '../../../models/user/user.model';

@Component({
  selector: 'app-communities-list',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    MatProgressSpinner,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './communities-list.component.html',
  styleUrl: './communities-list.component.scss',
})
export class CommunitiesListComponent implements OnInit {
  communities$ = this.store.select(selectAllCommunities);
  loading$ = this.store.select(selectCommunityLoading);
  isUserLoggedIn$: Observable<boolean>;
  userRole!: string;
  userDetails: Observable<User>;
  createdById!: string;

  /* Search in user side */
  filteredCommunites$: Observable<any[]>;
  searchTerm: string = '';
  private searchSubject = new BehaviorSubject<string>('');

  constructor(private store: Store) {
    this.isUserLoggedIn$ = this.store.select(selectIsAuthenticated);

    this.userDetails = this.store.select(selectUser).pipe(
      take(1),
      filter((user) => !!user)
    );

    /* Search in User side */
    this.filteredCommunites$ = combineLatest([
      this.communities$,
      this.searchSubject.asObservable(),
    ]).pipe(
      map(([communities, searchTerm]) => {
        if (!searchTerm.trim()) {
          return communities;
        }

        const term = searchTerm.toLowerCase().trim();
        return communities.filter(
          (community) =>
            community.name.toLowerCase().includes(term) ||
            community.description.toLowerCase().includes(term)
        );
      })
    );
  }

  ngOnInit(): void {
    /* User Side */
    this.store.dispatch(CommunityActions.loadAllCommunities());

    /* Farmer Side */
    this.userDetails.subscribe((user) => {
      this.userRole = user.role;
      this.createdById = user.id;
    });
    if (this.userRole === 'farmer') {
      this.store.dispatch(
        CommunityActions.loadCommunities({ createdById: this.createdById })
      );
      console.log(this.userRole, 'this is the front the front-end');

      this.communities$.subscribe((communities) => {
        console.log('Communities data:', communities);
      });
    }
  }

  /* User side */
  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.searchSubject.next(this.searchTerm);
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
