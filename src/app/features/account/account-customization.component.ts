import { Component, inject, OnInit, signal } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { UserProfileSettingsService } from '../../core/services/user-profile-settings.service';
import { LangSwitcherComponent } from '../../shared/lang-switcher/lang-switcher.component';

@Component({
  selector: 'app-account-customization',
  standalone: true,
  imports: [LangSwitcherComponent],
  templateUrl: './account-customization.component.html',
  styleUrls: ['./account-page-host.scss', './account.component.scss'],
})
export class AccountCustomizationComponent implements OnInit {
  readonly i18n = inject(I18nService);
  readonly profileSettings = inject(UserProfileSettingsService);

  loading = signal(true);

  ngOnInit(): void {
    this.profileSettings.loadProfile().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false),
    });
  }

  onRoundLessonPricesChange(checked: boolean): void {
    this.profileSettings.updateRoundLessonPrices(checked);
  }
}
