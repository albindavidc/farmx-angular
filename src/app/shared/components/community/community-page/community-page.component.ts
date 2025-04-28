import { Component, OnInit } from '@angular/core';
import { filter, map, Observable, take, tap } from 'rxjs';
import { CommunityActions } from '../../../../store/community/community.actions';
import { ActivatedRoute } from '@angular/router';
import {
  selectCommunityLoading,
  selectCurrentCommunity,
  selectJoinedCommunity,
} from '../../../../store/community/community.selectors';
import { Store } from '@ngrx/store';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { PostListComponent } from './post-list/post-list.component';
import { MessageInputComponent } from './message-input/message-input.component';
import { CommunityPostActions } from '../../../../store/community/post/community-post.actions';
import { selectUser } from '../../../../store/auth/selectors/auth.selectors';

@Component({
  selector: 'app-community-page',
  imports: [
    CommonModule,
    MatIcon,
    MatProgressSpinner,
    PostListComponent,
    MessageInputComponent,
  ],
  templateUrl: './community-page.component.html',
  styleUrl: './community-page.component.scss',
})
export class CommunityPageComponent implements OnInit {
  communityId!: string;
  community$ = this.store.select(selectCurrentCommunity);
  loading$ = this.store.select(selectCommunityLoading);

  userRole!: string;
  userDetails: Observable<string>;

  constructor(private route: ActivatedRoute, private store: Store) {
    this.userDetails = this.store.select(selectUser).pipe(
      take(1),
      filter((user) => !!user),
      map((user) => user.role)
    );
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        filter((params) => !!params['id']),
        tap((params) => {
          this.communityId = params['id'];
          this.store.dispatch(
            CommunityActions.loadCommunity({ communityId: this.communityId })
          );
          this.store.dispatch(
            CommunityPostActions.loadPosts({ communityId: this.communityId })
          );
        })
      )
      .subscribe();

    this.userDetails.subscribe((role) => {
      this.userRole = role;
    });
  }

  joinCommunity(): void {
    this.store.dispatch(
      CommunityActions.joinCommunity({ communityId: this.communityId })
    );
  }

  leaveCommunity(): void {
    this.store.dispatch(
      CommunityActions.leaveCommunity({ communityId: this.communityId })
    );
  }

  isCommunityJoined(): Observable<boolean> {
    return this.store.select(selectJoinedCommunity);
  }
}
