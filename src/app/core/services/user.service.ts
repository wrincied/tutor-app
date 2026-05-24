import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import type {
  UserProfile,
  UserWorkingHoursSettings,
  UserWorkspaceSettings,
} from '@interfaces';

import { apiUrl } from '../config/api-url';
import { AuthService } from './auth.service';

const API = apiUrl('');

export interface UpdateProfilePayload {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  tax_mode?: string;
  workspace?: UserWorkspaceSettings;
  workingHours?: UserWorkingHoursSettings;
}

export interface CompleteOnboardingPayload {
  first_name: string;
  last_name: string;
  country_settings: string;
  data_consent_accepted: boolean;
  marketing_cookies_accepted: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API}/auth/me`);
  }

  /** GET /me или bootstrap, если документа в Firestore ещё нет. */
  ensureProfile(): Observable<UserProfile> {
    return this.getProfile().pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          return this.auth.bootstrapProfile();
        }
        return throwError(() => err);
      }),
    );
  }

  updateProfile(payload: UpdateProfilePayload): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${API}/auth/me`, payload);
  }

  completeOnboarding(payload: CompleteOnboardingPayload): Observable<UserProfile> {
    return this.ensureProfile().pipe(
      switchMap(() => this.http.post<UserProfile>(`${API}/auth/onboarding`, payload)),
    );
  }

  declineOnboarding(): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${API}/auth/onboarding/decline`, {});
  }
}
