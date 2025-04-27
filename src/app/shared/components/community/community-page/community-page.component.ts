import { Component } from '@angular/core';
import { filter, Observable, tap } from 'rxjs';
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

@Component({
  selector: 'app-community-page',
  imports: [CommonModule, MatIcon, MatProgressSpinner],
  templateUrl: './community-page.component.html',
  styleUrl: './community-page.component.scss',
})
export class CommunityPageComponent {
  communityId!: string;
  community$ = this.store.select(selectCurrentCommunity);
  loading$ = this.store.select(selectCommunityLoading);

  constructor(private route: ActivatedRoute, private store: Store) {}

  ngOnInit(): void {
    this.route.params
      .pipe(
        filter((params) => !!params['id']),
        tap((params) => {
          this.communityId = params['id'];
          this.store.dispatch(
            CommunityActions.loadCommunity({ communityId: this.communityId })
          );
          // this.store.dispatch(
          //   PostActions.loadPosts({ communityId: this.communityId })
          // );
        })
      )
      .subscribe();
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
