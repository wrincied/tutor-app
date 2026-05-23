import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import type { SubscriptionStatus, UserProfile } from '@interfaces';
import { BillingService } from '../../core/services/billing.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import {
  canPurchaseSubscription,
  isTaxModeConfigured,
  subscriptionStatusLabel,
} from '../../core/utils/user-profile.utils';
import {
  formatSubscriptionPrice,
  getSubscriptionPricing,
} from '../../core/utils/subscription-pricing';

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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private billingPollSub: Subscription | null = null;

  readonly i18n = inject(I18nService);

  loading = signal(true);
  checkoutLoading = signal(false);
  error = signal<string | null>(null);
  profile = signal<UserProfile | null>(null);
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
    const fromApi = this.profile()?.subscription_pricing;
    if (fromApi) {
      return fromApi;
    }
    return getSubscriptionPricing(this.profile()?.country_settings ?? 'AT');
  });

  proPriceLabel = computed(() => {
    const p = this.pricing();
    const amount = this.billingInterval() === 'yearly' ? p.yearly : p.monthly;
    return formatSubscriptionPrice(amount, p.currency, this.i18n.localeId());
  });

  proPeriodLabel = computed(() => {
    const t = this.i18n.pricingUi().proPlan;
    return this.billingInterval() === 'yearly' ? t.periodYearly : t.periodMonthly;
  });

  freePriceLabel = computed(() => {
    const p = this.pricing();
    return formatSubscriptionPrice(0, p.currency, this.i18n.localeId());
  });

  subscriptionLabel = computed(() => {
    const t = this.i18n.accountUi();
    return subscriptionStatusLabel(this.subscriptionStatus(), {
      free: t.subscriptionFree,
      pro: t.subscriptionPro,
      trial: t.subscriptionTrial,
    });
  });

  ngOnInit(): void {
    this.userSvc.getProfile().subscribe({
      next: (user) => {
        this.profile.set(user);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.i18n.accountUi().loadError);
        this.loading.set(false);
      },
    });

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
