import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import type { SubscriptionStatus, TaxMode, UserProfile } from '@interfaces';
import type { CanComponentDeactivate } from '../../core/guards/can-deactivate.guard';
import { AuthService } from '../../core/services/auth.service';
import { BillingService } from '../../core/services/billing.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserProfileSettingsService } from '../../core/services/user-profile-settings.service';
import { UserService } from '../../core/services/user.service';
import {
  canPurchaseSubscription,
  isTaxModeConfigured,
  normalizeTaxMode,
  SETUP_TAX_MODES,
  subscriptionStatusLabel,
} from '../../core/utils/user-profile.utils';
import { resolveAccountAuthError } from '../../core/utils/auth-errors';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';
import { ActivityLogPanelComponent } from '../../shared/activity-log-panel/activity-log-panel.component';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [FormsModule, AppSelectComponent, RouterLink, AppDialogComponent, ActivityLogPanelComponent],
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-page-host.scss', './account.component.scss'],
})
export class AccountProfileComponent implements OnInit, CanComponentDeactivate {
  private readonly userSvc = inject(UserService);
  private readonly authSvc = inject(AuthService);
  private readonly billingSvc = inject(BillingService);
  private readonly router = inject(Router);
  private readonly profileSettings = inject(UserProfileSettingsService);
  private readonly unsavedDecision$ = new Subject<boolean>();

  readonly i18n = inject(I18nService);
  readonly skeletonFieldSlots = [0, 1, 2, 3];

  loading = signal(true);
  saving = signal(false);
  saved = signal(false);
  error = signal<string | null>(null);
  profile = signal<UserProfile | null>(null);
  taxConfirmOpen = signal(false);
  pendingTaxMode = signal<TaxMode | null>(null);
  unsavedOpen = signal(false);
  pendingNavigateUrl = signal<string | null>(null);
  /** Подтверждённый режим отличается от сохранённого профиля. */
  hasUnsavedTaxChange = signal(false);
  cancelConfirmOpen = signal(false);
  billingActionLoading = signal(false);

  firstName = '';
  lastName = '';
  newEmail = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  tax_mode: TaxMode | string = 'none';
  /** Значение селекта (синхронизируется после подтверждения в модалке). */
  taxModeSelectValue = 'none';
  subscription_status: SubscriptionStatus | string = 'free';

  taxModeConfigured = computed(() => {
    const profile = this.profile();
    return profile?.tax_mode_configured ?? isTaxModeConfigured(profile?.tax_mode ?? this.tax_mode);
  });

  canBuySubscription = computed(() => canPurchaseSubscription(this.profile()));
  /** Только если у Firebase есть password-провайдер (не Google-only). */
  showPasswordSection = computed(() => this.authSvc.canChangePassword());
  isGoogleOnlyAuth = computed(() => this.authSvc.isGoogleOnlyAuth());

  subscriptionLabel = computed(() => {
    const t = this.i18n.accountUi();
    return subscriptionStatusLabel(this.subscription_status, {
      free: t.subscriptionFree,
      basis: t.subscriptionBasis,
      pro: t.subscriptionPro,
      trial: t.subscriptionTrial,
    });
  });

  isPaidPlan = computed(() => {
    const status = this.subscription_status;
    return status === 'pro' || status === 'trial' || status === 'basis';
  });

  cancelScheduled = computed(
    () =>
      this.profile()?.cancel_at_period_end === true || this.profile()?.pending_plan === 'basis',
  );

  cancelScheduledHint = computed(() => {
    const profile = this.profile();
    const raw =
      profile?.pending_plan_at ||
      profile?.subscription_cancel_at ||
      profile?.subscription_current_period_end ||
      profile?.trial_ends_at;
    if (!raw) {
      return this.i18n.accountUi().cancelSubscriptionScheduled.replace('{date}', '—');
    }
    const label = new Intl.DateTimeFormat(this.i18n.localeId(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(raw));
    return this.i18n.accountUi().cancelSubscriptionScheduled.replace('{date}', label);
  });

  canManageStripeSub = computed(() => this.isPaidPlan());

  taxModeSelectOptions = computed((): AppSelectOption[] =>
    SETUP_TAX_MODES.map((value) => ({
      value,
      label: this.i18n.taxModeLabel(value),
    })),
  );

  taxModeConfirmMessage = computed(() => {
    const mode = this.pendingTaxMode();
    if (!mode) {
      return '';
    }
    const label = this.i18n.taxModeLabel(mode);
    return this.i18n.accountUi().taxModeConfirmBody.replace('{mode}', label);
  });

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): void {
    if (!this.hasUnsavedTaxChange()) {
      return;
    }
    event.preventDefault();
    event.returnValue = '';
  }

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

  canDeactivate(): Observable<boolean> | boolean {
    if (!this.hasUnsavedTaxChange()) {
      return true;
    }
    this.pendingNavigateUrl.set(null);
    this.unsavedOpen.set(true);
    return this.unsavedDecision$.pipe(take(1));
  }

  onTaxModePick(next: string): void {
    const normalized = normalizeTaxMode(next);
    if (!isTaxModeConfigured(normalized)) {
      this.tax_mode = normalized;
      this.taxModeSelectValue = normalized;
      this.syncUnsavedTaxFlag();
      return;
    }
    if (normalized === normalizeTaxMode(this.tax_mode)) {
      this.taxModeSelectValue = normalized;
      return;
    }
    this.pendingTaxMode.set(normalized as TaxMode);
    this.taxConfirmOpen.set(true);
    this.taxModeSelectValue = String(this.tax_mode);
  }

  onTaxModeConfirm(): void {
    const pending = this.pendingTaxMode();
    if (pending) {
      this.tax_mode = pending;
      this.taxModeSelectValue = pending;
      this.syncUnsavedTaxFlag();
    }
    this.taxConfirmOpen.set(false);
    this.pendingTaxMode.set(null);
  }

  onTaxModeConfirmCancel(): void {
    this.taxConfirmOpen.set(false);
    this.pendingTaxMode.set(null);
    this.taxModeSelectValue = String(this.tax_mode);
  }

  onPricingClick(event: Event): void {
    if (!this.hasUnsavedTaxChange()) {
      return;
    }
    event.preventDefault();
    this.pendingNavigateUrl.set('/app/pricing');
    this.unsavedOpen.set(true);
  }

  openCancelConfirm(): void {
    this.cancelConfirmOpen.set(true);
  }

  closeCancelConfirm(): void {
    this.cancelConfirmOpen.set(false);
  }

  confirmCancelSubscription(): void {
    this.billingActionLoading.set(true);
    this.error.set(null);
    this.billingSvc.cancelSubscription().subscribe({
      next: (user) => {
        this.applyProfile(user);
        this.profileSettings.hydrate(user);
        this.billingActionLoading.set(false);
        this.cancelConfirmOpen.set(false);
      },
      error: (err) => {
        this.billingActionLoading.set(false);
        this.error.set(
          err?.error?.message ?? this.i18n.accountUi().cancelSubscriptionError,
        );
      },
    });
  }

  resumeSubscription(): void {
    this.billingActionLoading.set(true);
    this.error.set(null);
    this.billingSvc.resumeSubscription().subscribe({
      next: (user) => {
        this.applyProfile(user);
        this.profileSettings.hydrate(user);
        this.billingActionLoading.set(false);
      },
      error: (err) => {
        this.billingActionLoading.set(false);
        this.error.set(
          err?.error?.message ?? this.i18n.accountUi().cancelSubscriptionError,
        );
      },
    });
  }

  onUnsavedStay(): void {
    this.unsavedOpen.set(false);
    this.pendingNavigateUrl.set(null);
    this.unsavedDecision$.next(false);
  }

  onUnsavedLeave(): void {
    const url = this.pendingNavigateUrl();
    this.unsavedOpen.set(false);
    this.pendingNavigateUrl.set(null);
    this.discardTaxChanges();
    this.unsavedDecision$.next(true);
    if (url) {
      void this.router.navigateByUrl(url);
    }
  }

  private syncUnsavedTaxFlag(): void {
    const profile = this.profile();
    if (!profile) {
      this.hasUnsavedTaxChange.set(false);
      return;
    }
    this.hasUnsavedTaxChange.set(
      normalizeTaxMode(this.tax_mode) !== normalizeTaxMode(profile.tax_mode),
    );
  }

  private discardTaxChanges(): void {
    const profile = this.profile();
    if (!profile) {
      return;
    }
    this.tax_mode = (profile.tax_mode as TaxMode) || 'none';
    this.taxModeSelectValue = String(this.tax_mode);
    this.hasUnsavedTaxChange.set(false);
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
    this.taxModeSelectValue = String(this.tax_mode);
    this.subscription_status = (user.subscription_status as SubscriptionStatus) || 'free';
    this.hasUnsavedTaxChange.set(false);
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

    if (!isTaxModeConfigured(this.tax_mode)) {
      this.error.set(t.taxModeRequiredHint);
      return;
    }
    const currentTax = normalizeTaxMode(current?.tax_mode);
    if (normalizeTaxMode(this.tax_mode) !== currentTax) {
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
            this.error.set(
              resolveAccountAuthError(err, t, this.i18n.authUi().passwordMinLength),
            );
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
            this.error.set(
              resolveAccountAuthError(err, t, this.i18n.authUi().passwordMinLength),
            );
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
