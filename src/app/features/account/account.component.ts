import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import type { Lang, SubscriptionStatus, TaxMode, UserProfile } from '@interfaces';

import { AuthService } from '../../core/services/auth.service';

import { BelarusFlagService, type BelarusFlagVariant } from '../../core/services/belarus-flag.service';
import { I18nService } from '../../core/services/i18n.service';

import { ThemeService } from '../../core/services/theme.service';

import { UserService } from '../../core/services/user.service';

import {

  canPurchaseSubscription,

  isTaxModeConfigured,

  SETUP_TAX_MODES,

  subscriptionStatusLabel,

} from '../../core/utils/user-profile.utils';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';



@Component({

  selector: 'app-account',

  standalone: true,

  imports: [FormsModule, AppSelectComponent, RouterLink],

  templateUrl: './account.component.html',

  styleUrl: './account.component.scss',

})

export class AccountComponent implements OnInit {

  private readonly userSvc = inject(UserService);

  private readonly authSvc = inject(AuthService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  readonly i18n = inject(I18nService);

  readonly theme = inject(ThemeService);

  readonly belarusFlag = inject(BelarusFlagService);

  loading = signal(true);
  readonly skeletonFieldSlots = [0, 1, 2, 3];

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

  pickLang(code: Lang): void {

    this.i18n.setLang(code);

  }



  flagIcon(code: Lang): string {
    if (code === 'by') {
      return this.belarusFlag.iconPath();
    }
    const icons: Record<Exclude<Lang, 'by'>, string> = {
      ru: '/assets/icons/flag-ru.svg',
      en: '/assets/icons/flag-en.svg',
      de: '/assets/icons/flag-at.svg',
      kz: '/assets/icons/flag-kz.svg',
      uk: '/assets/icons/flag-uk.svg',
    };
    return icons[code];
  }

  pickBelarusFlag(variant: BelarusFlagVariant): void {
    this.belarusFlag.setVariant(variant);
  }



  ngOnInit(): void {

    this.userSvc.getProfile().subscribe({

      next: (user) => this.applyProfile(user),

      error: () => {

        this.error.set(this.i18n.accountUi().loadError);

        this.loading.set(false);

      },

    });

    const billingResult = this.route.snapshot.queryParamMap.get('billing');
    if (billingResult === 'success' || billingResult === 'cancel') {
      void this.router.navigate(['/app/pricing'], {
        queryParams: { billing: billingResult },
        replaceUrl: true,
      });
      return;
    }
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



    if (this.newPassword && this.newPassword !== this.confirmPassword) {

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
    const passwordChanging = Boolean(this.newPassword);

    if (emailChanging || passwordChanging) {
      if (!this.currentPassword) {
        this.error.set(t.currentPasswordRequired);
        return;
      }
    }

    this.saving.set(true);

    const profileUpdate$ = () => this.userSvc.updateProfile(payload);

    const finish = (user: UserProfile) => {
      this.applyProfile(user);
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.saving.set(false);
      this.saved.set(true);
      if (emailChanging) {
        void this.router.navigate(['/app/verify-email-notice']);
      }
    };

    if (emailChanging || passwordChanging) {
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

    profileUpdate$().subscribe({
      next: (user) => finish(user),
      error: (err) => {
        this.saving.set(false);

        this.error.set(err?.error?.message ?? t.saveError);

      },

    });

  }

}


