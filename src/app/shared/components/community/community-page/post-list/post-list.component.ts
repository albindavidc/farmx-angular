import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { Post } from '../../../../models/post.model';
import { Store } from '@ngrx/store';
import { map, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { CommunityPostActions } from '../../../../../store/community/post/community-post.actions';
import {
  selectCommunityPostLoading,
  selectCommunityPosts,
} from '../../../../../store/community/post/community-post.selectors';
import { MatDialog } from '@angular/material/dialog';
import { UserRole } from '../../../../models/user-role';
import { selectUser } from '../../../../../store/auth/selectors/auth.selectors';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-post-list',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss',
})
export class PostListComponent implements OnInit, OnDestroy {
  @Input() communityId!: string;
  loading$ = this.store.select(selectCommunityPostLoading);
  UserRole = UserRole;
  posts$: Observable<Post[]>;

  editForm: FormGroup;
  editingPostId: string | null = null;
  editSelectedImage: File | null = null;
  editImagePreview: string | null = null;
  editLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private actions$: Actions
  ) {
    this.editForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(500)]],
    });

    this.posts$ = this.store.select(selectCommunityPosts);

    this.posts$.pipe(takeUntil(this.destroy$)).subscribe((posts) => {
      console.log('Current posts in store:', posts);
      console.log('Number of posts:', posts ? posts.length : 0);
      console.log('Post details:', JSON.stringify(posts, null, 2));
    });

    // Also log action dispatches
    this.actions$
      .pipe(
        ofType(
          CommunityPostActions.loadPosts,
          CommunityPostActions.loadPostsSuccess,
          CommunityPostActions.loadPostsFailure
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((action) => {
        console.log('Post action dispatched:', action.type, action);
      });
  }

  ngOnInit(): void {
    if (this.communityId) {
      this.store.dispatch(
        CommunityPostActions.loadPosts({ communityId: this.communityId })
      );

      this.actions$
        .pipe(
          ofType(CommunityPostActions.loadPostsSuccess),
          take(1),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.posts$ = this.store.select(selectCommunityPosts).pipe(
            tap((posts) => {
              console.log(
                `Loaded ${posts?.length || 0} posts for community ${
                  this.communityId
                }`
              );
            })
          );
        });
    } else {
      console.error('Community ID is not defined');
    }

     this.posts$.subscribe(posts => {
    console.log('Posts in component:', posts);
  });
  }

  canEdit(post: Post): Observable<boolean> {
    return this.store.select(selectUser).pipe(
      map((currentUser) => {
        if (!currentUser) return false;

        return (
          currentUser.id === post.userId ||
          ['farmer', 'admin'].includes(currentUser.role)
        );
      })
    );
  }

  isEditing(postId?: string): boolean {
    return !!postId && this.editingPostId === postId;
  }

  startEditing(post: Post): void {
    this.editingPostId = post.id!;
    this.editForm.patchValue({
      text: post.text,
    });

    if (post.imageUrl) {
      this.editImagePreview = post.imageUrl;
    } else {
      this.editImagePreview = null;
    }

    this.editSelectedImage = null;
  }

  cancelEdit(): void {
    this.editingPostId = null;
    this.editForm.reset();
    this.editSelectedImage = null;
    this.editImagePreview = null;
  }

  onEditImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        return;
      }

      this.editSelectedImage = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.editImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeEditImage(): void {
    this.editSelectedImage = null;
    this.editImagePreview = null;
  }

  submitEdit(postId: string): void {
    if (this.editForm.valid) {
      this.editLoading = true;

      const text = this.editForm.get('text')?.value;

      this.store.dispatch(
        CommunityPostActions.editPost({
          postId,
          text,
          image: this.editSelectedImage || undefined,
        })
      );

      // Reset edit mode
      setTimeout(() => {
        this.editingPostId = null;
        this.editForm.reset();
        this.editSelectedImage = null;
        this.editImagePreview = null;
        this.editLoading = false;
      }, 1000); // Give time for the edit operation to complete
    }
  }

  deletePost(post: Post): void {
    console.log('this is from the front-end of the postid', post)
    if (post.id && confirm('Are you sure you want to delete this post?')) {
      this.store.dispatch(CommunityPostActions.deletePost({ postId : post.id}));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
