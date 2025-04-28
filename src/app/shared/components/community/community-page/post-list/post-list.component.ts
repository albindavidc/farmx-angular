import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { map, Observable, Subject } from 'rxjs';
import { CommunityPostActions } from '../../../../../store/community/post/community-post.actions';
import { selectCommunityPosts } from '../../../../../store/community/post/community-post.selectors';
import { selectCommunityLoading } from '../../../../../store/community/community.selectors';
import { MatDialog } from '@angular/material/dialog';
import { UserRole } from '../../../../models/user-role';
import { selectUser } from '../../../../../store/auth/selectors/auth.selectors';

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
  posts$ = this.store.select(selectCommunityPosts);
  loading$ = this.store.select(selectCommunityLoading);
  UserRole = UserRole;

  editForm: FormGroup;
  editingPostId: string | null = null;
  editSelectedImage: File | null = null;
  editImagePreview: string | null = null;
  editLoading = false;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.editForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {}

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

  deletePost(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.store.dispatch(CommunityPostActions.deletePost({ postId }));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
