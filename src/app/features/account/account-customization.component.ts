import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { Lang } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';
import { UserProfileSettingsService } from '../../core/services/user-profile-settings.service';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';

@Component({
  selector: 'app-account-customization',
  standalone: true,
  imports: [FormsModule, AppSelectComponent],
  templateUrl: './account-customization.component.html',
  styleUrls: ['./account-page-host.scss', './account.component.scss'],
})
export class AccountCustomizationComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly profileSettings = inject(UserProfileSettingsService);

  loading = signal(true);

  languageOptions = computed((): AppSelectOption[] => {
    this.i18n.lang();
    return this.i18n.allLangs.map((code) => ({
      value: code,
      label: this.i18n.labelForLang(code),
    }));
  });

  ngOnInit(): void {
    this.profileSettings.loadProfile().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  pickLang(code: string): void {
    this.i18n.setLang(code as Lang);
  }
}
