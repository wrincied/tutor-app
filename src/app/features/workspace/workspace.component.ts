import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { UserVacationSettings, UserWorkingHoursSettings } from '@interfaces';
import {
  WORKSPACE_LESSON_DURATIONS,
  clampLessonDurationMinutes,
  isWorkspaceDurationPreset,
  LESSON_DURATION_MAX,
  LESSON_DURATION_MIN,
  normalizeVacation,
  normalizeWorkingHours,
  type IsoWeekday,
} from '../../core/utils/user-workspace-settings';
import { I18nService } from '../../core/services/i18n.service';
import { UserProfileSettingsService } from '../../core/services/user-profile-settings.service';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';
import { AppDateRangeComponent } from '../../shared/app-date-input';

const ISO_WEEKDAYS: readonly IsoWeekday[] = [1, 2, 3, 4, 5, 6, 7];

type DurationMode = 'preset' | 'custom';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [FormsModule, AppSelectComponent, AppDateRangeComponent],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.scss',
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  readonly i18n = inject(I18nService);
  readonly profileSettings = inject(UserProfileSettingsService);

  readonly isoWeekdays = ISO_WEEKDAYS;
  readonly durationPresets = WORKSPACE_LESSON_DURATIONS;
  readonly durationMin = LESSON_DURATION_MIN;
  readonly durationMax = LESSON_DURATION_MAX;

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  toastMessage = signal<string | null>(null);
  toastKind = signal<'success' | 'error'>('success');
  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  durationMode: DurationMode = 'preset';
  durationPreset = 60;
  customDuration = 50;

  hoursStart = '08:00';
  hoursEnd = '21:00';
  workingDays: IsoWeekday[] = [1, 2, 3, 4, 5];

  vacationEnabled = false;
  vacationStart = '';
  vacationEnd = '';
  vacationMessage = '';

  workingHourOptions = computed((): AppSelectOption[] =>
    this.profileSettings.hourSelectOptions.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
  );

  weekdayLabels = computed(() => {
    const t = this.i18n.calendarUi();
    return {
      1: t.weekdayMon,
      2: t.weekdayTue,
      3: t.weekdayWed,
      4: t.weekdayThu,
      5: t.weekdayFri,
      6: t.weekdaySat,
      7: t.weekdaySun,
    } as Record<IsoWeekday, string>;
  });

  ngOnInit(): void {
    this.profileSettings.loadProfile().subscribe({
      next: () => {
        this.applyDraftFromProfile();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
  }

  selectDurationPreset(minutes: number): void {
    this.durationMode = 'preset';
    this.durationPreset = minutes;
  }

  selectDurationCustom(): void {
    if (this.durationMode === 'preset') {
      this.customDuration = this.durationPreset;
    }
    this.durationMode = 'custom';
  }

  toggleWorkingDay(day: IsoWeekday): void {
    const set = new Set(this.workingDays);
    if (set.has(day)) {
      set.delete(day);
    } else {
      set.add(day);
    }
    const next = [...set].sort((a, b) => a - b) as IsoWeekday[];
    this.workingDays = next.length > 0 ? next : [day];
  }

  isWorkingDaySelected(day: IsoWeekday): boolean {
    return this.workingDays.includes(day);
  }

  showToast(message: string, kind: 'success' | 'error' = 'success'): void {
    this.toastKind.set(kind);
    this.toastMessage.set(message);
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    this.toastTimer = setTimeout(() => {
      this.toastTimer = null;
      this.toastMessage.set(null);
    }, 3200);
  }

  dismissToast(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    this.toastMessage.set(null);
  }

  private resolvedDurationMinutes(): number {
    const raw = this.durationMode === 'custom' ? this.customDuration : this.durationPreset;
    return clampLessonDurationMinutes(raw);
  }

  private isDurationDraftValid(): boolean {
    const raw = this.durationMode === 'custom' ? Number(this.customDuration) : this.durationPreset;
    if (!Number.isFinite(raw)) {
      return false;
    }
    const minutes = Math.round(raw);
    return minutes >= LESSON_DURATION_MIN && minutes <= LESSON_DURATION_MAX;
  }

  saveAll(): void {
    const t = this.i18n.accountUi();
    this.error.set(null);

    if (!this.isDurationDraftValid()) {
      this.error.set(t.workspaceDurationInvalid);
      this.showToast(t.workspaceDurationInvalid, 'error');
      return;
    }

    const vacation: UserVacationSettings = normalizeVacation({
      enabled: this.vacationEnabled,
      startDate: this.vacationStart,
      endDate: this.vacationEnd,
      message: this.vacationMessage,
    });

    if (vacation.enabled && (!vacation.startDate || !vacation.endDate)) {
      this.error.set(t.vacationDatesRequired);
      this.showToast(t.vacationDatesRequired, 'error');
      return;
    }
    if (vacation.enabled && vacation.endDate < vacation.startDate) {
      this.error.set(t.vacationDatesInvalid);
      this.showToast(t.vacationDatesInvalid, 'error');
      return;
    }

    const workingHours: UserWorkingHoursSettings = normalizeWorkingHours({
      start: this.hoursStart,
      end: this.hoursEnd,
      days: this.workingDays,
    });

    this.saving.set(true);
    this.profileSettings
      .saveWorkspaceSettings({
        workspace: {
          ...this.profileSettings.workspace(),
          defaultLessonDuration: this.resolvedDurationMinutes(),
        },
        workingHours,
        vacation,
      })
      .subscribe({
        next: () => {
          this.applyDraftFromProfile();
          this.saving.set(false);
          this.showToast(t.workspaceSaved, 'success');
        },
        error: () => {
          this.saving.set(false);
          this.error.set(t.workspaceSaveError);
          this.showToast(t.workspaceSaveError, 'error');
        },
      });
  }

  private applyDraftFromProfile(): void {
    const workspace = this.profileSettings.workspace();
    const hours = this.profileSettings.workingHours();
    const vacation = this.profileSettings.vacation();
    const duration = workspace.defaultLessonDuration;
    if (isWorkspaceDurationPreset(duration)) {
      this.durationMode = 'preset';
      this.durationPreset = duration;
    } else {
      this.durationMode = 'custom';
      this.customDuration = duration;
    }
    this.hoursStart = hours.start;
    this.hoursEnd = hours.end;
    this.workingDays = [...hours.days];
    this.vacationEnabled = vacation.enabled;
    this.vacationStart = vacation.startDate;
    this.vacationEnd = vacation.endDate;
    this.vacationMessage = vacation.message;
  }
}
