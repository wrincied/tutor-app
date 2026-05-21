import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { UserProfile } from '@interfaces';

const API = 'http://localhost:3001/api';

export interface UpdateProfilePayload {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  country_settings?: string;
  tax_mode?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API}/auth/me`);
  }

  updateProfile(payload: UpdateProfilePayload): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${API}/auth/me`, payload);
  }
}
