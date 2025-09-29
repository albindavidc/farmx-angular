import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../models/user/user.model';
import { UserQueryParams } from '../../models/user/user-query-params.model';
import { PaginatedResponse } from '../../models/paginated-response.model';

interface ApiResponse<T> {
  success: string;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiURL}/api`;
  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    const message =
      error.error?.message || 'Something went wrong; please try again later.';
    return throwError(() => new Error(message));
  }

  getUsers(params: UserQueryParams): Observable<PaginatedResponse<User[]>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString())
      .set('sortBy', params.sortBy)
      .set('sortDirection', params.sortDirection);

    if (params.search && params.search.trim()) {
      httpParams = httpParams.set('search', params.search.trim());
    }

    return this.http
      .get<ApiResponse<PaginatedResponse<User[]>>>(
        `${this.apiUrl}/admin/get-users`,
        {
          params: httpParams,
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => response.data),
        catchError(this.handleError)
      );
  }

  // getUsers(): Observable<User[]> {
  //   return this.http
  //     .get<ApiResponse<User[]>>(`${this.apiUrl}/admin/get-users`, {
  //       withCredentials: true,
  //     })
  //     .pipe(map((response) => response.data));
  // }

  updateUser(user: User): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.apiUrl}/admin/${user.id}`, user, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/admin/create-user`, user, {
      withCredentials: true,
    });
  }

  blockUser(user: User, newStatus: boolean): Observable<User> {
    return this.http.put<User>(
      `${this.apiUrl}/admin/block-user/${user.id}`,
      { id: user.id, isBlocked: newStatus },
      { withCredentials: true }
    );
  }
}
