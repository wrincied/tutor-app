import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, switchMap, tap } from 'rxjs/operators';
import type { UserProfile } from '@interfaces';
import {
  DEFAULT_WORKING_HOURS,
  DEFAULT_WORKSPACE,
  HOUR_OPTIONS,
  buildGridHours,
  normalizeWorkingHours,
  normalizeWorkspace,
  parseHourToken,
  type IsoWeekday,
  type UserWorkingHoursSettings,
  type UserWorkspaceSettings,
  type WorkspaceCurrency,
  type WorkspaceLessonDuration,
} from '../utils/user-workspace-settings';
import { UserService, type UpdateProfilePayload } from './user.service';

@Injectable({ providedIn: 'root' })
export class UserProfileSettingsService {
  private readonly userSvc = inject(UserService);
  private readonly profile = signal<UserProfile | null>(null);
  private readonly saveQueue$ = new Subject<UpdateProfilePayload>();
  readonly workspace = computed(() => normalizeWorkspace(this.profile()?.workspace));
  readonly workingHours = computed(() => normalizeWorkingHours(this.profile()?.workingHours));
  readonly gridStartHour = computed(() => parseHourToken(this.workingHours().start));
  readonly gridEndHour = computed(() => parseHourToken(this.workingHours().end));
  readonly gridHours = computed(() =>
    buildGridHours(this.workingHours().start, this.workingHours().end),
  );
  readonly hourSelectOptions = HOUR_OPTIONS.map((value) => ({ value, label: value }));

  constructor() {
    this.saveQueue$
      .pipe(
        debounceTime(500),
        switchMap((payload) =>
          this.userSvc.updateProfile(payload).pipe(
            tap((user) => this.profile.set(user)),
            catchError(() => of(null)),
          ),
        ),
      )
      .subscribe();
  }

  hydrate(user: UserProfile): void {
    this.profile.set(user);
  }

  loadProfile(): Observable<UserProfile> {
    return this.userSvc.getProfile().pipe(tap((user) => this.hydrate(user)));
  }

  updateWorkspaceName(name: string): void {
    const next = { ...this.workspace(), name: name.trim().slice(0, 120) };
    this.patchProfile({ workspace: next });
  }

  updateWorkspaceCurrency(currency: WorkspaceCurrency): void {
    this.patchProfile({ workspace: { ...this.workspace(), currency } });
  }

  updateWorkspaceDuration(defaultLessonDuration: WorkspaceLessonDuration): void {
    this.patchProfile({ workspace: { ...this.workspace(), defaultLessonDuration } });
  }

  updateWorkingHoursStart(start: string): void {
    const next = { ...this.workingHours(), start };
    this.patchProfile({ workingHours: this.clampWorkingHours(next) });
  }

  updateWorkingHoursEnd(end: string): void {
    const next = { ...this.workingHours(), end };
    this.patchProfile({ workingHours: this.clampWorkingHours(next) });
  }

  toggleWorkingDay(day: IsoWeekday): void {
    const current = new Set(this.workingHours().days);
    if (current.has(day)) {
      current.delete(day);
    } else {
      current.add(day);
    }
    const days = [...current].sort((a, b) => a - b) as IsoWeekday[];
    this.patchProfile({
      workingHours: { ...this.workingHours(), days },
    });
  }

  isWorkingDay(date: Date): boolean {
    const iso = date.getDay() === 0 ? 7 : date.getDay();
    return this.workingHours().days.includes(iso as IsoWeekday);
  }

  private clampWorkingHours(hours: UserWorkingHoursSettings): UserWorkingHoursSettings {
    const normalized = normalizeWorkingHours(hours);
    if (parseHourToken(normalized.end) <= parseHourToken(normalized.start)) {
      return DEFAULT_WORKING_HOURS;
    }
    return normalized;
  }

  private patchProfile(
    patch: Pick<UpdateProfilePayload, 'workspace' | 'workingHours'>,
  ): void {
    const current = this.profile();
    if (!current) {
      return;
    }
    const nextProfile: UserProfile = {
      ...current,
      workspace: patch.workspace ?? current.workspace,
      workingHours: patch.workingHours ?? current.workingHours,
    };
    this.profile.set(nextProfile);
    this.saveQueue$.next(patch);
  }
}
