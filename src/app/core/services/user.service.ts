import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, throwError } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
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

export interface UpdateMarketingCookiesPayload {
  accepted: boolean;
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
  private readonly fireAuth = inject(Auth);

  /** Один in-flight /me на UID — guards, navbar и home делят один ответ. */
  private profile$?: Observable<UserProfile>;
  private cachedUid: string | null = null;

  constructor() {
    authState(this.fireAuth).subscribe((user) => {
      const uid = user?.uid ?? null;
      if (uid !== this.cachedUid) {
        this.invalidateProfile();
      }
    });
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${API}/auth/me`);
  }

  /** Сбрасывает кэш профиля (logout / смена пользователя). */
  invalidateProfile(): void {
    this.profile$ = undefined;
    this.cachedUid = null;
  }

  /** GET /me или bootstrap, если документа в Firestore ещё нет. */
  ensureProfile(): Observable<UserProfile> {
    const uid = this.auth.firebaseUser()?.uid ?? null;
    if (!uid) {
      this.invalidateProfile();
      return throwError(() => new Error('Not authenticated'));
    }
    if (this.profile$ && this.cachedUid === uid) {
      return this.profile$;
    }

    this.cachedUid = uid;
    this.profile$ = this.getProfile().pipe(
      catchError((err: unknown) => {
        if (err instanceof HttpErrorResponse && err.status === 404) {
          return this.auth.bootstrapProfile();
        }
        this.invalidateProfile();
        return throwError(() => err);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );
    return this.profile$;
  }

  updateProfile(payload: UpdateProfilePayload): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${API}/auth/me`, payload).pipe(
      tap((profile) => this.replaceCachedProfile(profile)),
    );
  }

  updateMarketingCookies(accepted: boolean): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${API}/auth/me/marketing-cookies`, { accepted }).pipe(
      tap((profile) => this.replaceCachedProfile(profile)),
    );
  }

  completeOnboarding(payload: CompleteOnboardingPayload): Observable<UserProfile> {
    return this.ensureProfile().pipe(
      switchMap(() => this.http.post<UserProfile>(`${API}/auth/onboarding`, payload)),
      tap((profile) => this.replaceCachedProfile(profile)),
    );
  }

  declineOnboarding(): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(`${API}/auth/onboarding/decline`, {}).pipe(
      tap(() => this.invalidateProfile()),
    );
  }

  private replaceCachedProfile(profile: UserProfile): void {
    const uid = this.auth.firebaseUser()?.uid ?? null;
    this.cachedUid = uid;
    this.profile$ = of(profile).pipe(shareReplay({ bufferSize: 1, refCount: false }));
  }
}
