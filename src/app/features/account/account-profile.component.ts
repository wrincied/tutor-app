import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import type { SubscriptionStatus, TaxMode, UserProfile } from '@interfaces';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserProfileSettingsService } from '../../core/services/user-profile-settings.service';
import { UserService } from '../../core/services/user.service';
import {
  canPurchaseSubscription,
  isTaxModeConfigured,
  SETUP_TAX_MODES,
  subscriptionStatusLabel,
} from '../../core/utils/user-profile.utils';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [FormsModule, AppSelectComponent, RouterLink],
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-page-host.scss', './account.component.scss'],
})
export class AccountProfileComponent implements OnInit {
  private readonly userSvc = inject(UserService);
  private readonly authSvc = inject(AuthService);
  private readonly router = inject(Router);
  private readonly profileSettings = inject(UserProfileSettingsService);

  readonly i18n = inject(I18nService);
  readonly skeletonFieldSlots = [0, 1, 2, 3];

  loading = signal(true);
  saving = signal(false);
  saved = signal(false);
  error = signal<string | null>(null);
  profile = signal<UserProfile | null>(null);

  firstName = '';
  lastName = '';
  newEmail = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  tax_mode: TaxMode | string = 'none';
  subscription_status: SubscriptionStatus | string = 'free';

  taxModeConfigured = computed(() => {
    const profile = this.profile();
    return profile?.tax_mode_configured ?? isTaxModeConfigured(profile?.tax_mode ?? this.tax_mode);
  });

  canBuySubscription = computed(() => canPurchaseSubscription(this.profile()));
  showPasswordSection = computed(() => this.authSvc.canChangePassword());

  subscriptionLabel = computed(() => {
    const t = this.i18n.accountUi();
    return subscriptionStatusLabel(this.subscription_status, {
      free: t.subscriptionFree,
      pro: t.subscriptionPro,
      trial: t.subscriptionTrial,
    });
  });

  taxModeSelectOptions = computed((): AppSelectOption[] =>
    SETUP_TAX_MODES.map((value) => ({
      value,
      label: this.i18n.taxModeLabel(value),
    })),
  );

  ngOnInit(): void {
    this.userSvc.getProfile().subscribe({
      next: (user) => {
        this.applyProfile(user);
        this.profileSettings.hydrate(user);
      },
      error: () => {
        this.error.set(this.i18n.accountUi().loadError);
        this.loading.set(false);
      },
    });
  }

  private applyProfile(user: UserProfile): void {
    this.profile.set(user);
    this.firstName = user.first_name ?? '';
    this.lastName = user.last_name ?? '';
    if (!this.firstName && user.name) {
      const parts = user.name.trim().split(/\s+/);
      this.firstName = parts[0] ?? '';
      this.lastName = parts.slice(1).join(' ');
    }
    this.newEmail = user.email;
    this.tax_mode = (user.tax_mode as TaxMode) || 'none';
    this.subscription_status = (user.subscription_status as SubscriptionStatus) || 'free';
    this.loading.set(false);
  }

  save(): void {
    const t = this.i18n.accountUi();
    this.error.set(null);
    this.saved.set(false);

    if (
      this.showPasswordSection() &&
      this.newPassword &&
      this.newPassword !== this.confirmPassword
    ) {
      this.error.set(t.passwordsMismatch);
      return;
    }

    const payload: Parameters<UserService['updateProfile']>[0] = {};
    const current = this.profile();
    const trimmedFirst = this.firstName.trim();
    const trimmedLast = this.lastName.trim();
    if (
      !current ||
      trimmedFirst !== (current.first_name ?? '').trim() ||
      trimmedLast !== (current.last_name ?? '').trim()
    ) {
      payload.first_name = trimmedFirst;
      payload.last_name = trimmedLast;
    }

    if (!this.taxModeConfigured()) {
      if (!isTaxModeConfigured(this.tax_mode)) {
        this.error.set(t.taxModeRequiredHint);
        return;
      }
      payload.tax_mode = this.tax_mode;
    }

    const emailChanging =
      current && this.newEmail.trim() && this.newEmail.trim() !== current.email;
    const passwordChanging = this.showPasswordSection() && Boolean(this.newPassword);

    if (passwordChanging && !this.currentPassword) {
      this.error.set(t.currentPasswordRequired);
      return;
    }

    if (emailChanging && this.showPasswordSection() && !this.currentPassword) {
      this.error.set(t.currentPasswordRequired);
      return;
    }

    this.saving.set(true);
    const profileUpdate$ = () => this.userSvc.updateProfile(payload);

    const finish = (user: UserProfile) => {
      this.applyProfile(user);
      this.profileSettings.hydrate(user);
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.saving.set(false);
      this.saved.set(true);
      if (emailChanging) {
        void this.router.navigate(['/app/verify-email-notice']);
      }
    };

    if (passwordChanging || (emailChanging && this.showPasswordSection())) {
      this.authSvc
        .updateCredentials({
          currentPassword: this.currentPassword,
          newEmail: emailChanging ? this.newEmail.trim() : undefined,
          newPassword: passwordChanging ? this.newPassword : undefined,
        })
        .pipe(switchMap(() => profileUpdate$()))
        .subscribe({
          next: (user) => finish(user),
          error: (err) => {
            this.saving.set(false);
            this.error.set(err?.message || t.saveError);
          },
        });
      return;
    }

    if (emailChanging) {
      this.authSvc
        .updateEmailWithGoogleReauth(this.newEmail.trim())
        .pipe(switchMap(() => profileUpdate$()))
        .subscribe({
          next: (user) => finish(user),
          error: (err) => {
            this.saving.set(false);
            this.error.set(err?.message || t.saveError);
          },
        });
      return;
    }

    profileUpdate$().subscribe({
      next: (user) => finish(user),
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.error?.message ?? t.saveError);
      },
    });
  }
}
