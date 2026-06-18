import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Lang, WorkspaceCurrency, WorkspaceLessonDuration } from '@interfaces';
import {
  WORKSPACE_CURRENCIES,
  WORKSPACE_LESSON_DURATIONS,
  type IsoWeekday,
} from '../../core/utils/user-workspace-settings';
import { I18nService } from '../../core/services/i18n.service';
import { ThemeService } from '../../core/services/theme.service';
import { UserProfileSettingsService } from '../../core/services/user-profile-settings.service';
import { BelarusFlagComponent } from '../../shared/belarus-flag/belarus-flag.component';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';

const ISO_WEEKDAYS: readonly IsoWeekday[] = [1, 2, 3, 4, 5, 6, 7];

@Component({
  selector: 'app-account-customization',
  standalone: true,
  imports: [FormsModule, AppSelectComponent, BelarusFlagComponent],
  templateUrl: './account-customization.component.html',
  styleUrls: ['./account-page-host.scss', './account.component.scss'],
})
export class AccountCustomizationComponent implements OnInit {
  readonly i18n = inject(I18nService);
  readonly theme = inject(ThemeService);
  readonly profileSettings = inject(UserProfileSettingsService);

  readonly isoWeekdays = ISO_WEEKDAYS;
  loading = signal(true);
  workspaceAutosave = signal<'idle' | 'saving' | 'saved'>('idle');

  workspaceCurrencyOptions = computed((): AppSelectOption[] =>
    WORKSPACE_CURRENCIES.map((value) => ({ value, label: value })),
  );

  workspaceDurationOptions = computed((): AppSelectOption[] =>
    WORKSPACE_LESSON_DURATIONS.map((value) => ({
      value: String(value),
      label: `${value} ${this.i18n.calendarUi().durationMinShort}`,
    })),
  );

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
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  pickLang(code: Lang): void {
    this.i18n.setLang(code);
  }

  flagIcon(code: Lang): string | null {
    if (code === 'by') {
      return null;
    }
    const icons: Record<Exclude<Lang, 'by'>, string> = {
      ru: 'assets/icons/flag-ru.svg',
      en: 'assets/icons/flag-en.svg',
      de: 'assets/icons/flag-at.svg',
      kz: 'assets/icons/flag-kz.svg',
      uk: 'assets/icons/flag-uk.svg',
    };
    return icons[code];
  }

  onWorkspaceNameChange(value: string): void {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkspaceName(value);
  }

  onWorkspaceCurrencyChange(value: string): void {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkspaceCurrency(value as WorkspaceCurrency);
  }

  onWorkspaceDurationChange(value: string): void {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkspaceDuration(Number(value) as WorkspaceLessonDuration);
  }

  onWorkingHoursStartChange(value: string): void {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkingHoursStart(value);
  }

  onWorkingHoursEndChange(value: string): void {
    this.markWorkspaceSaving();
    this.profileSettings.updateWorkingHoursEnd(value);
  }

  toggleWorkingDay(day: IsoWeekday): void {
    this.markWorkspaceSaving();
    this.profileSettings.toggleWorkingDay(day);
  }

  isWorkingDaySelected(day: IsoWeekday): boolean {
    return this.profileSettings.workingHours().days.includes(day);
  }

  private markWorkspaceSaving(): void {
    this.workspaceAutosave.set('saving');
    window.setTimeout(() => this.workspaceAutosave.set('saved'), 700);
    window.setTimeout(() => this.workspaceAutosave.set('idle'), 2200);
  }
}
