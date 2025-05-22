import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Community } from '../../models/community.model';

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private apiUrl = `${environment.apiURL}/community`;

  constructor(private http: HttpClient) {}

  getCommunities(
    page: number = 1,
    limit: number = 10,
    sortField: string = 'creationDate',
    sortDirection: 'asc' | 'desc' = 'desc',
    filter: string = ''
  ): Observable<PaginatedResponse<Community>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);

    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get<PaginatedResponse<Community>>(
      `${this.apiUrl}/admin/communities-listing`,
      {
        params,
        withCredentials: true,
      }
    );
  }

  getCommunityById(id: string): Observable<Community> {
    return this.http.get<Community>(`${this.apiUrl}/${id}`);
  }

  createCommunity(community: Community): Observable<Community> {
    return this.http.post<Community>(this.apiUrl, community);
  }

  updateCommunity(id: string, community: Community): Observable<Community> {
    return this.http.put<Community>(`${this.apiUrl}/${id}`, 
      community,
    );
  }

  deleteCommunity(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
