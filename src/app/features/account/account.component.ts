import { Component, computed, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

import type { Lang, SubscriptionStatus, TaxMode, UserProfile } from '@interfaces';

import { BillingService } from '../../core/services/billing.service';

import { I18nService } from '../../core/services/i18n.service';

import { ThemeService } from '../../core/services/theme.service';

import { UserService } from '../../core/services/user.service';

import {

  canPurchaseSubscription,

  isTaxModeConfigured,

  SETUP_TAX_MODES,

  subscriptionStatusLabel,

} from '../../core/utils/user-profile.utils';

import {
  formatSubscriptionPrice,
  getSubscriptionPricing,
} from '../../core/utils/subscription-pricing';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../shared/app-select';



const COUNTRIES = ['AT', 'DE', 'PL', 'RU', 'BY', 'KZ', 'US'] as const;



@Component({

  selector: 'app-account',

  standalone: true,

  imports: [FormsModule, AppSelectComponent, AppDialogComponent],

  templateUrl: './account.component.html',

  styleUrl: './account.component.scss',

})

export class AccountComponent implements OnInit {

  private readonly userSvc = inject(UserService);

  private readonly billingSvc = inject(BillingService);

  readonly i18n = inject(I18nService);

  readonly theme = inject(ThemeService);

  readonly countries = COUNTRIES;



  loading = signal(true);

  saving = signal(false);

  checkoutLoading = signal(false);

  subscriptionInfoOpen = signal(false);

  saved = signal(false);

  error = signal<string | null>(null);



  profile = signal<UserProfile | null>(null);



  newEmail = '';

  currentPassword = '';

  newPassword = '';

  confirmPassword = '';

  country_settings = 'AT';

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



  countrySelectOptions = computed((): AppSelectOption[] =>

    this.countries.map((c) => ({ value: c, label: c })),

  );

  subscriptionPricing = computed(() => getSubscriptionPricing(this.country_settings));

  subscriptionMonthlyPrice = computed(() => {
    const p = this.subscriptionPricing();
    return formatSubscriptionPrice(p.monthly, p.currency, this.i18n.localeId());
  });

  subscriptionYearlyPrice = computed(() => {
    const p = this.subscriptionPricing();
    return formatSubscriptionPrice(p.yearly, p.currency, this.i18n.localeId());
  });

  openSubscriptionInfo(): void {
    this.subscriptionInfoOpen.set(true);
  }

  closeSubscriptionInfo(): void {
    this.subscriptionInfoOpen.set(false);
  }

  pickLang(code: Lang): void {

    this.i18n.setLang(code);

  }



  flagIcon(code: Lang): string {

    const icons: Record<Lang, string> = {

      ru: '/assets/icons/flag-ru.svg',

      en: '/assets/icons/flag-en.svg',

      de: '/assets/icons/flag-de.svg',

      kz: '/assets/icons/flag-kz.svg',

    };

    return icons[code];

  }



  ngOnInit(): void {

    this.userSvc.getProfile().subscribe({

      next: (user) => this.applyProfile(user),

      error: () => {

        this.error.set(this.i18n.accountUi().loadError);

        this.loading.set(false);

      },

    });

  }



  private applyProfile(user: UserProfile): void {

    this.profile.set(user);

    this.newEmail = user.email;

    this.country_settings = user.country_settings || 'AT';

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



    const payload: Parameters<UserService['updateProfile']>[0] = {

      country_settings: this.country_settings,

    };



    if (!this.taxModeConfigured()) {

      if (!isTaxModeConfigured(this.tax_mode)) {

        this.error.set(t.taxModeRequiredHint);

        return;

      }

      payload.tax_mode = this.tax_mode;

    }



    const current = this.profile();

    if (current && this.newEmail.trim() && this.newEmail.trim() !== current.email) {

      payload.email = this.newEmail.trim();

    }

    if (this.newPassword) {

      payload.newPassword = this.newPassword;

    }

    if (payload.email || payload.newPassword) {

      if (!this.currentPassword) {

        this.error.set(t.currentPasswordRequired);

        return;

      }

      payload.currentPassword = this.currentPassword;

    }



    this.saving.set(true);

    this.userSvc.updateProfile(payload).subscribe({

      next: (user) => {

        this.applyProfile(user);

        this.currentPassword = '';

        this.newPassword = '';

        this.confirmPassword = '';

        this.saving.set(false);

        this.saved.set(true);

      },

      error: (err) => {

        this.saving.set(false);

        this.error.set(err?.error?.message ?? t.saveError);

      },

    });

  }



  startProCheckout(): void {

    const t = this.i18n.accountUi();

    if (!this.canBuySubscription()) {

      this.error.set(t.taxRequiredForBilling);

      return;

    }

    this.checkoutLoading.set(true);

    this.error.set(null);

    this.billingSvc.createCheckoutSession().subscribe({

      next: ({ url }) => {

        this.checkoutLoading.set(false);

        if (url) {

          window.location.href = url;

        }

      },

      error: (err) => {

        this.checkoutLoading.set(false);

        this.error.set(err?.error?.message ?? t.saveError);

      },

    });

  }

}


