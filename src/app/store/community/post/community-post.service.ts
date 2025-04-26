import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../../shared/models/post.model';

@Injectable({
  providedIn: 'root',
})
export class CommunityPostService {
  private readonly apiUrl = environment.apiURL;
  constructor(private http: HttpClient) {}

  uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    if (image) {
      formData.append('file', image);
    }

    return this.http
      .post<{ imageUrl: string }>(`${this.apiUrl}/community/post-upload-image`, formData)
      .pipe(map((response) => response.imageUrl));
  }

  getPost(communityId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?communityId=${communityId}`);
  }
}
