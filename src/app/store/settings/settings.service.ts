import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/auth-state.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly apiurl = `${environment.apiURL}`;
  constructor(private http: HttpClient) {}

  updateProfile(updates: Partial<User>): Observable<User> {
    return this.http.patch<User>(
      `${this.apiurl}/settings/update-profile`,
      updates,
      { withCredentials: true }
    );
  }
}
