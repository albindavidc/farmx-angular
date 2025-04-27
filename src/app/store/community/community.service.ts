import { Injectable } from '@angular/core';
import { map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { Community } from '../../shared/models/community.model';
import { Store } from '@ngrx/store';
import { selectUser } from '../auth/selectors/auth.selectors';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { User } from '../../shared/models/auth-state.model';
import { response } from 'express';

export interface ApiResponse<T> {
  message: string;
  success: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private readonly apiUrl = environment.apiURL;
  constructor(private store: Store, private http: HttpClient) {}

  createCommunity(
    name: string,
    description: string,
    categories?: string[],
    image?: File
  ): Observable<Community> {
    return this.store.select(selectUser).pipe(
      take(1),
      switchMap((user: User | null) => {
        if (!user) {
          return throwError(
            () => new Error('User is required to create the community')
          );
        }
        let processedImage$: Observable<string | undefined>;

        if (image) {
          processedImage$ = this.uploadImage(image);
        } else {
          processedImage$ = of(undefined);
        }

        return processedImage$.pipe(
          switchMap((imageUrl) => {
            const community: Partial<Community> = {
              name,
              description,
              createdAt: new Date(),
              createdBy: user.id,
              memberCount: 1,
              categories,
              imageUrl,
            };

            return this.http.post<Community>(
              `${this.apiUrl}/community/create-community`,
              community,
              { withCredentials: true }
            );
          })
        );
      })
    );
  }

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', image);

    return this.http
      .post<{ imageUrl: string }>(
        `${this.apiUrl}/community/upload-image`,
        formData,
        { withCredentials: true }
      )
      .pipe(map((response) => response.imageUrl));
  }

  getCommunities(): Observable<Community[]> {
    return this.http
      .get<ApiResponse<Community[]>>(`${this.apiUrl}/community`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

  getCommunity(id: string): Observable<Community> {
    return this.http
      .get<ApiResponse<Community>>(`${this.apiUrl}/community/${id}`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

  joinCommunity(id: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(
      `${this.apiUrl}/community/${id}/members`,
      {
        withCredentials: true,
      }
    );
  }

  leaveCommunity(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.apiUrl}/community/${id}/members`,
      {
        withCredentials: true,
      }
    );
  }
}
