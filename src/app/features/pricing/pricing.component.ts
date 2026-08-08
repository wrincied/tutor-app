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
import { getPlanPricing, getSubscriptionPricing } from '../../core/utils/subscription-pricing';
import { markBillingCheckoutPending } from '../../core/utils/billing-return';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';

export type BillingInterval = 'monthly' | 'yearly';
export type CheckoutPlan = 'basis' | 'pro';
type DowngradeTarget = 'free' | 'basis';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [RouterLink, AppDialogComponent],
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
  checkoutLoading = signal<CheckoutPlan | null>(null);
  downgradeLoading = signal(false);
  error = signal<string | null>(null);
  profile = signal<UserProfile | null>(null);
  /** Public /pricing visit without auth. */
  readonly isGuest = signal(false);
  billingInterval = signal<BillingInterval>('monthly');
  openFaqIndex = signal<number | null>(null);
  downgradeConfirmOpen = signal(false);
  downgradeTarget = signal<DowngradeTarget | null>(null);

  taxModeConfigured = computed(() => {
    const profile = this.profile();
    return profile?.tax_mode_configured ?? isTaxModeConfigured(profile?.tax_mode);
  });

  canBuy = computed(() => canPurchaseSubscription(this.profile()));

  subscriptionStatus = computed(
    () => (this.profile()?.subscription_status as SubscriptionStatus) || 'free',
  );

  isFree = computed(() => {
    const s = this.subscriptionStatus();
    return s === 'free' || !s;
  });
  isBasis = computed(() => this.subscriptionStatus() === 'basis');
  isPro = computed(() => this.subscriptionStatus() === 'pro');
  isTrial = computed(() => this.subscriptionStatus() === 'trial');
  isProOrTrial = computed(() => this.isPro() || this.isTrial());
  cancelScheduled = computed(() => this.profile()?.cancel_at_period_end === true);

  cancelScheduledDateLabel = computed(() => {
    const raw = this.profile()?.subscription_cancel_at || this.profile()?.trial_ends_at;
    if (!raw) {
      return '—';
    }
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(raw));
  });

  cancelScheduledCtaLabel = computed(() =>
    this.t.cancelScheduledCta.replace('{date}', this.cancelScheduledDateLabel()),
  );

  cancelScheduledHintLabel = computed(() =>
    this.t.cancelScheduledHint.replace('{date}', this.cancelScheduledDateLabel()),
  );

  pricingCountry = computed(() => {
    if (this.isGuest()) {
      return 'AT';
    }
    const profile = this.profile();
    return resolvePricingCountry(profile?.tax_mode, profile?.country_settings);
  });

  /** @deprecated Prefer plan-specific getters; kept for currency. */
  pricing = computed(() => getSubscriptionPricing(this.pricingCountry()));

  basisPricing = computed(() => getPlanPricing('basis', this.pricingCountry()));
  proPricing = computed(() => getPlanPricing('pro', this.pricingCountry()));

  pricingCurrency = computed(() => this.proPricing().currency);

  freeAmountLabel = computed(() => this.formatAmount(0));

  basisAmountLabel = computed(() => {
    const p = this.basisPricing();
    const amount = this.billingInterval() === 'yearly' ? p.yearly / 12 : p.monthly;
    return this.formatAmount(amount);
  });

  proAmountLabel = computed(() => {
    const p = this.proPricing();
    const amount = this.billingInterval() === 'yearly' ? p.yearly / 12 : p.monthly;
    return this.formatAmount(amount);
  });

  basisPeriodLabel = computed(() => this.i18n.pricingUi().basisPlan.periodMonthly);
  proPeriodLabel = computed(() => this.i18n.pricingUi().proPlan.periodMonthly);

  basisBilledAnnuallyLabel = computed(() => {
    if (this.billingInterval() !== 'yearly') return null;
    const p = this.basisPricing();
    return this.i18n
      .pricingUi()
      .basisPlan.billedAnnually.replace('{amount}', this.formatAmount(p.yearly))
      .replace('{currency}', p.currency);
  });

  proBilledAnnuallyLabel = computed(() => {
    if (this.billingInterval() !== 'yearly') return null;
    const p = this.proPricing();
    return this.i18n
      .pricingUi()
      .proPlan.billedAnnually.replace('{amount}', this.formatAmount(p.yearly))
      .replace('{currency}', p.currency);
  });

  subscriptionLabel = computed(() => {
    const t = this.i18n.accountUi();
    return subscriptionStatusLabel(this.subscriptionStatus(), {
      free: t.subscriptionFree,
      basis: t.subscriptionBasis,
      pro: t.subscriptionPro,
      trial: t.subscriptionTrial,
    });
  });

  canBuyBasis = computed(() => this.canBuy() && this.isFree());
  canBuyPro = computed(() => this.canBuy() && (this.isFree() || this.isBasis()));

  downgradeDialogTitle = computed(() => {
    const t = this.t;
    return this.downgradeTarget() === 'basis' ? t.downgradeToBasisTitle : t.downgradeToFreeTitle;
  });

  downgradeDialogBody = computed(() => {
    const t = this.t;
    return this.downgradeTarget() === 'basis' ? t.downgradeToBasisBody : t.downgradeToFreeBody;
  });

  downgradeDialogConfirm = computed(() => {
    const t = this.t;
    if (this.downgradeLoading()) {
      return t.downgradeLoading;
    }
    return this.downgradeTarget() === 'basis'
      ? t.downgradeToBasisConfirm
      : t.downgradeToFreeConfirm;
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

    const gate = this.route.snapshot.queryParamMap.get('gate');
    if (gate === 'finance' && this.auth.isLoggedIn()) {
      this.error.set(this.i18n.sharedUi().planFinanceRequiredBody);
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { gate: null },
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

  openDowngradeConfirm(target: DowngradeTarget): void {
    if (this.isGuest() || this.downgradeLoading() || this.checkoutLoading()) {
      return;
    }
    if (target === 'free') {
      if (this.isFree() || this.cancelScheduled()) {
        return;
      }
    } else if (target === 'basis') {
      if (!this.isProOrTrial()) {
        return;
      }
    }
    this.error.set(null);
    this.downgradeTarget.set(target);
    this.downgradeConfirmOpen.set(true);
  }

  closeDowngradeConfirm(): void {
    if (this.downgradeLoading()) {
      return;
    }
    this.downgradeConfirmOpen.set(false);
    this.downgradeTarget.set(null);
  }

  confirmDowngrade(): void {
    const target = this.downgradeTarget();
    if (!target || this.downgradeLoading()) {
      return;
    }

    this.downgradeLoading.set(true);
    this.error.set(null);

    const request =
      target === 'basis'
        ? this.billingSvc.changePlan('basis')
        : this.billingSvc.cancelSubscription();

    request.subscribe({
      next: (user) => {
        this.profile.set(user);
        this.userSvc.invalidateProfile();
        this.downgradeLoading.set(false);
        this.downgradeConfirmOpen.set(false);
        this.downgradeTarget.set(null);
      },
      error: (err) => {
        this.downgradeLoading.set(false);
        this.error.set(err?.error?.message ?? this.i18n.accountUi().cancelSubscriptionError);
      },
    });
  }

  startCheckout(plan: CheckoutPlan): void {
    if (plan === 'basis' && !this.canBuyBasis()) return;
    if (plan === 'pro' && !this.canBuyPro()) return;
    if (this.isProOrTrial()) return;

    this.checkoutLoading.set(plan);
    this.error.set(null);
    this.billingSvc.createCheckoutSession(this.billingInterval(), plan).subscribe({
      next: ({ url }) => {
        this.checkoutLoading.set(null);
        if (url) {
          markBillingCheckoutPending();
          window.location.href = url;
        }
      },
      error: (err) => {
        this.checkoutLoading.set(null);
        this.error.set(err?.error?.message ?? this.i18n.accountUi().saveError);
      },
    });
  }

  startProCheckout(): void {
    this.startCheckout('pro');
  }

  startBasisCheckout(): void {
    this.startCheckout('basis');
  }

  private startBillingSuccessPoll(): void {
    this.billingPollSub?.unsubscribe();
    this.userSvc.invalidateProfile();
    this.billingSvc.syncSubscription().subscribe({
      next: (user) => {
        this.userSvc.cacheProfile(user);
        this.profile.set(user);
      },
      error: () => undefined,
    });
    this.billingPollSub = timer(0, 2000)
      .pipe(
        take(15),
        switchMap(() => this.userSvc.getProfile()),
      )
      .subscribe({
        next: (user) => {
          this.userSvc.cacheProfile(user);
          this.profile.set(user);
          const status = String(user.subscription_status || 'free');
          if (status === 'pro' || status === 'trial' || status === 'basis') {
            this.billingPollSub?.unsubscribe();
            this.billingPollSub = null;
          }
        },
      });
  }
}
