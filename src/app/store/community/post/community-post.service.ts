import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../../shared/models/post.model';
import { selectUser } from '../../auth/selectors/auth.selectors';
import { Store } from '@ngrx/store';
import { CommunityService } from '../community.service';

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

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    if (image) {
      formData.append('file', image);
    }

    return this.http
      .post<{ imageUrl: string }>(
        `${this.apiUrl}/community/post-upload-image`,
        formData
      )
      .pipe(map((response) => response.imageUrl));
  }

  getPosts(communityId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?communityId=${communityId}`);
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
            let processedImage$: Observable<string | undefined>;

            if (image) {
              processedImage$ = this.uploadImage(image);
            } else {
              processedImage$ = of(undefined);
            }

            return processedImage$.pipe(
              switchMap((imageUrl) => {
                const post: Omit<Post, 'id'> = {
                  text,
                  imageUrl,
                  communityId,
                  communityName: community.name,
                  createdAt: new Date(),
                  userId: currentUser.id,
                  userName: currentUser.name,
                  userRole: currentUser.role,
                };

                return this.http.post<Post>(this.apiUrl, post);
              })
            );
          })
        );
      })
    );
  }

  editPost(postId: string, text: string, image?: File): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${postId}`).pipe(
      switchMap((post) => {
        let processedImage$: Observable<string | undefined>;

        if (image) {
          processedImage$ = this.uploadImage(image);
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

            return this.http.put<Post>(`${this.apiUrl}/${postId}`, updatedPost);
          })
        );
      })
    );
  }

  deletePost(postId: string): Observable<void> {
    return this.http.get<Post>(`${this.apiUrl}/${postId}`).pipe(
      switchMap((post) => {
        return this.http.delete<void>(`${this.apiUrl}/${postId}`);
      })
    );
  }
}
