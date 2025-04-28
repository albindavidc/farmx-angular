import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../../../store/auth/selectors/auth.selectors';
import { CommunityPostActions } from '../../../../../store/community/post/community-post.actions';

@Component({
  selector: 'app-message-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './message-input.component.html',
  styleUrl: './message-input.component.scss',
})
export class MessageInputComponent {
  @Input() communityId!: string;

  postForm: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  loading$ = this.store.select(slectCommunityPostLoading);
  userRole$ = this.store.select(selectUser);

  private maxChars = 500;

  constructor(private fb: FormBuilder, private store: Store) {
    this.postForm = this.fb.group({
      text: ['', [Validators.required, Validators.maxLength(this.maxChars)]],
    });
  }

  ngOnInit(): void {
    if (!this.communityId) {
      console.error('MessageInputComponent: communityId is required');
    }
  }

  onTextareaInput(): void {
    const textarea = document.getElementById(
      'auto-resize-textarea'
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should not exceed 5MB');
        return;
      }

      this.selectedImage = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  getRemainingChars(): number {
    const currentLength = this.postForm.get('text')?.value?.length || 0;
    return this.maxChars - currentLength;
  }

  submitPost(): void {
    if (this.postForm.valid) {
      const text = this.postForm.get('text')?.value;
      this.store.dispatch(
        CommunityPostActions.createPost({
          text,
          image: this.selectedImage || undefined,
          communityId: this.communityId,
        })
      );

      // Reset form
      this.postForm.reset();
      this.selectedImage = null;
      this.imagePreview = null;

      // Reset textarea height
      const textarea = document.getElementById(
        'auto-resize-textarea'
      ) as HTMLTextAreaElement;
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  }
}
function slectCommunityPostLoading(state: object): unknown {
  throw new Error('Function not implemented.');
}
