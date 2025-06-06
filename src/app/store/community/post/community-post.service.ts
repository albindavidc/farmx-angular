import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../../shared/models/post.model';
import { selectUser } from '../../auth/selectors/auth.selectors';
import { Store } from '@ngrx/store';
import { CommunityService } from '../community.service';

export interface ApiResponse<T> {
  message: string;
  success: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class CommunityPostService {
  private readonly apiUrl = environment.apiURL;
  constructor(
    private http: HttpClient,
    private store: Store,
    private communityService: CommunityService
  ) {}

  uploadImage(image: File, postId: string): Observable<string> {
    const formData = new FormData();
    if (image) {
      formData.append('file', image);
    }
    if (postId) {
      formData.append('postId', postId);
    }

    console.log('this is the upload image postid and image', image, postId)

    const id = postId.toString();

    return this.http
      .post<{ imageUrl: string }>(
        `${this.apiUrl}/community/post-upload-image/${id}`,
        formData,
        { withCredentials: true }
      )
      .pipe(map((response) => response.imageUrl));
  }

  getPosts(id: string): Observable<Post[]> {
    return this.http
      .get<ApiResponse<Post[]>>(`${this.apiUrl}/community/posts/${id}`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.data));
  }

  createPost(
    text: string,
    communityId: string,
    image?: File
  ): Observable<Post> {
    return this.store.select(selectUser).pipe(
      take(1),
      switchMap((currentUser) => {
        if (!currentUser) {
          return throwError(() => new Error('User not authenticated'));
        }
        return this.communityService.getCommunity(communityId).pipe(
          switchMap((community) => {
            // First create the post without image
            const post: Omit<Post, 'id'> = {
              text,
              imageUrl: undefined,
              communityId,
              communityName: community.name,
              createdAt: new Date(),
              userId: currentUser.id,
              userName: currentUser.name,
              userRole: currentUser.role,
            };

            return this.http
              .post<Post>(`${this.apiUrl}/community/create-post`, post, {
                withCredentials: true,
              })
              .pipe(
                // Then upload image with the post ID if image exists
                switchMap((createdPost) => {
                  if (image && createdPost.id) {
                    return this.uploadImage(image, createdPost.id).pipe(
                      switchMap((imageUrl) => {

                        console.log('this is created post id while uploading image' + createdPost.id)

                        // Update the post with the image URL
                        const updatedPost = {
                          ...createdPost,
                          imageUrl,
                        };
                        return this.http.put<Post>(
                          `${this.apiUrl}/community/posts/${createdPost.id}`,
                          updatedPost,
                          { withCredentials: true }
                        );
                      })
                    );
                  }

                  console.log('this is the image and createpost.id after creating post' + image + createdPost.id)
                  return of(createdPost);
                })
              );
          })
        );
      })
    );
  }

  editPost(postId: string, text: string, image?: File): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/community/community-post/${postId}`, {withCredentials: true}).pipe(
      switchMap((post) => {
        let processedImage$: Observable<string | undefined>;

        if (image) {
          processedImage$ = this.uploadImage(image, postId); 
        } else {
          processedImage$ = of(post.imageUrl);
        }

        return processedImage$.pipe(
          switchMap((imageUrl) => {
            const updatedPost: Post = {
              ...post,
              text,
              imageUrl,
              isEdited: true,
              lastEditedAt: new Date(),
            };

            return this.http.put<Post>(
              `${this.apiUrl}/community/posts/${postId}`,
              updatedPost,
              { withCredentials: true }
            );
          })
        );
      })
    );
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/community/posts/${postId}`, {
      withCredentials: true
    })
    
  }
}
