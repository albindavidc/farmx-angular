import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../models/user/user.model';

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

  getUsers(): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(`${this.apiUrl}/admin/get-users`, {
        withCredentials: true,
      })
      .pipe(map((response) => response.data));
  }

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
