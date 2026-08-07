import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import type { SubscriptionStatus, UserProfile } from '@interfaces';
import { AuthService } from '../../core/services/auth.service';
import { BillingService } from '../../core/services/billing.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import {
  canPurchaseSubscription,
  isTaxModeConfigured,
  resolvePricingCountry,
  subscriptionStatusLabel,
} from '../../core/utils/user-profile.utils';
import { getSubscriptionPricing } from '../../core/utils/subscription-pricing';
import { markBillingCheckoutPending } from '../../core/utils/billing-return';

export type BillingInterval = 'monthly' | 'yearly';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss',
})
export class PricingComponent implements OnInit, OnDestroy {
  private readonly userSvc = inject(UserService);
  private readonly billingSvc = inject(BillingService);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private billingPollSub: Subscription | null = null;

  readonly i18n = inject(I18nService);

  loading = signal(true);
  checkoutLoading = signal(false);
  error = signal<string | null>(null);
  profile = signal<UserProfile | null>(null);
  /** Public /pricing visit without auth. */
  readonly isGuest = signal(false);
  billingInterval = signal<BillingInterval>('monthly');
  openFaqIndex = signal<number | null>(null);

  taxModeConfigured = computed(() => {
    const profile = this.profile();
    return profile?.tax_mode_configured ?? isTaxModeConfigured(profile?.tax_mode);
  });

  canBuy = computed(() => canPurchaseSubscription(this.profile()));

  subscriptionStatus = computed(
    () => (this.profile()?.subscription_status as SubscriptionStatus) || 'free',
  );

  isPro = computed(() => this.subscriptionStatus() === 'pro');
  isTrial = computed(() => this.subscriptionStatus() === 'trial');

  pricing = computed(() => {
    if (this.isGuest()) {
      // Public marketing page: primary market (AT / EUR).
      return getSubscriptionPricing('AT');
    }
    const profile = this.profile();
    const country = resolvePricingCountry(profile?.tax_mode, profile?.country_settings);
    return getSubscriptionPricing(country);
  });

  pricingCurrency = computed(() => this.pricing().currency);

  /** Large price: monthly rate, or yearly÷12 when Yearly is selected. */
  proAmountLabel = computed(() => {
    const p = this.pricing();
    const amount = this.billingInterval() === 'yearly' ? p.yearly / 12 : p.monthly;
    return this.formatAmount(amount);
  });

  freeAmountLabel = computed(() => this.formatAmount(0));

  /** Always “per month” under the large amount (Variant A). */
  proPeriodLabel = computed(() => this.i18n.pricingUi().proPlan.periodMonthly);

  /** Small annual total line — only in Yearly mode. */
  proBilledAnnuallyLabel = computed(() => {
    if (this.billingInterval() !== 'yearly') return null;
    const p = this.pricing();
    return this.i18n
      .pricingUi()
      .proPlan.billedAnnually.replace('{amount}', this.formatAmount(p.yearly))
      .replace('{currency}', p.currency);
  });

  subscriptionLabel = computed(() => {
    const t = this.i18n.accountUi();
    return subscriptionStatusLabel(this.subscriptionStatus(), {
      free: t.subscriptionFree,
      pro: t.subscriptionPro,
      trial: t.subscriptionTrial,
    });
  });

  private formatAmount(amount: number): string {
    const fractionDigits = Number.isFinite(amount) && !Number.isInteger(amount) ? 2 : 0;
    return new Intl.NumberFormat(this.i18n.localeId(), {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  }

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      this.profile.set(null);
      this.isGuest.set(true);
      this.loading.set(false);
    } else {
      this.userSvc.getProfile().subscribe({
        next: (user) => {
          this.profile.set(user);
          this.isGuest.set(false);
          this.loading.set(false);
        },
        error: () => {
          this.profile.set(null);
          this.isGuest.set(true);
          this.error.set(null);
          this.loading.set(false);
        },
      });
    }

    const billingResult = this.route.snapshot.queryParamMap.get('billing');
    if (billingResult === 'success') {
      this.startBillingSuccessPoll();
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { billing: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  ngOnDestroy(): void {
    this.billingPollSub?.unsubscribe();
  }

  get t() {
    return this.i18n.pricingUi();
  }

  setBillingInterval(interval: BillingInterval): void {
    this.billingInterval.set(interval);
  }

  toggleFaq(index: number): void {
    this.openFaqIndex.update((current) => (current === index ? null : index));
  }

  isFaqOpen(index: number): boolean {
    return this.openFaqIndex() === index;
  }

  startProCheckout(): void {
    if (!this.canBuy() || this.isPro() || this.isTrial()) {
      return;
    }
    this.checkoutLoading.set(true);
    this.error.set(null);
    this.billingSvc.createCheckoutSession(this.billingInterval()).subscribe({
      next: ({ url }) => {
        this.checkoutLoading.set(false);
        if (url) {
          markBillingCheckoutPending();
          window.location.href = url;
        }
      },
      error: (err) => {
        this.checkoutLoading.set(false);
        this.error.set(err?.error?.message ?? this.i18n.accountUi().saveError);
      },
    });
  }

  private startBillingSuccessPoll(): void {
    this.billingPollSub?.unsubscribe();
    this.billingPollSub = timer(0, 2000)
      .pipe(
        take(15),
        switchMap(() => this.userSvc.getProfile()),
      )
      .subscribe({
        next: (user) => {
          this.profile.set(user);
          const status = String(user.subscription_status || 'free');
          if (status === 'pro' || status === 'trial') {
            this.billingPollSub?.unsubscribe();
            this.billingPollSub = null;
          }
        },
      });
  }
}
