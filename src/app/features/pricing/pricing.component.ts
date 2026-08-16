import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
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
import { getPlanPricing, getSubscriptionPricing, formatSubscriptionPrice } from '../../core/utils/subscription-pricing';
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
  private readonly plansTrack = viewChild<ElementRef<HTMLElement>>('plansTrack');

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
  /** Active card index for the mobile snap carousel (below 1024px). */
  plansScrollIndex = signal(0);

  readonly planDots = computed(() => {
    const t = this.i18n.pricingUi();
    return [
      { id: 'free', label: t.freePlan.name },
      { id: 'basis', label: t.basisPlan.name },
      { id: 'pro', label: t.proPlan.name },
    ] as const;
  });

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
  basisDowngradeScheduled = computed(() => this.profile()?.pending_plan === 'basis');

  cancelScheduledDateLabel = computed(() => {
    const raw = this.profile()?.subscription_cancel_at || this.profile()?.trial_ends_at;
    if (!raw) {
      return '—';
    }
    return this.formatDateLabel(raw);
  });

  periodEndDateLabel = computed(() => {
    const profile = this.profile();
    const raw =
      profile?.pending_plan_at ||
      profile?.subscription_current_period_end ||
      profile?.trial_ends_at ||
      profile?.subscription_cancel_at;
    if (!raw) {
      return '—';
    }
    return this.formatDateLabel(raw);
  });

  basisDowngradePriceLabel = computed(() => {
    const p = this.basisPricing();
    const interval = this.profile()?.subscription_interval === 'yearly' ? 'yearly' : 'monthly';
    const amount = interval === 'yearly' ? p.yearly : p.monthly;
    return formatSubscriptionPrice(amount, p.currency, this.i18n.localeId());
  });

  cancelScheduledCtaLabel = computed(() =>
    this.t.cancelScheduledCta.replace('{date}', this.cancelScheduledDateLabel()),
  );

  cancelScheduledHintLabel = computed(() =>
    this.t.cancelScheduledHint.replace('{date}', this.cancelScheduledDateLabel()),
  );

  basisScheduledCtaLabel = computed(() =>
    this.t.downgradeBasisScheduledCta.replace('{date}', this.periodEndDateLabel()),
  );

  basisScheduledHintLabel = computed(() =>
    this.t.downgradeBasisScheduledHint.replace('{date}', this.periodEndDateLabel()),
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
    if (this.downgradeTarget() === 'basis') {
      return t.downgradeToBasisBody
        .replace('{current_period_end}', this.periodEndDateLabel())
        .replace('{basis_price}', this.basisDowngradePriceLabel());
    }
    return t.downgradeToFreeBody;
  });

  /** Left action label (Free keep / unused when Basis uses leading). */
  downgradeDialogCancel = computed(() => {
    const t = this.t;
    if (this.downgradeLoading() || this.downgradeTarget() === 'basis') {
      return null;
    }
    return t.downgradeKeep;
  });

  /** Left muted action for Pro → Basis (switch). */
  downgradeDialogLeading = computed(() => {
    const t = this.t;
    if (this.downgradeLoading() || this.downgradeTarget() !== 'basis') {
      return null;
    }
    return t.downgradeToBasisConfirm;
  });

  /** Right / primary: stay on Pro (Basis) or confirm Free schedule. */
  downgradeDialogConfirm = computed(() => {
    const t = this.t;
    if (this.downgradeLoading()) {
      return t.downgradeLoading;
    }
    return this.downgradeTarget() === 'basis' ? t.downgradeKeepPro : t.downgradeToFreeConfirm;
  });

  downgradePreferSafePrimary = computed(() => this.downgradeTarget() === 'basis');

  onDowngradeDialogCancel(): void {
    this.closeDowngradeConfirm();
  }

  onDowngradeDialogLeading(): void {
    this.confirmDowngrade();
  }

  onDowngradeDialogConfirm(): void {
    if (this.downgradeLoading()) {
      return;
    }
    if (this.downgradeTarget() === 'basis') {
      this.closeDowngradeConfirm();
      return;
    }
    this.confirmDowngrade();
  }

  private formatDateLabel(raw: string): string {
    return new Intl.DateTimeFormat(this.i18n.localeId(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(raw));
  }

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
    } else if (billingResult === 'cancel') {
      this.userSvc.invalidateProfile();
      this.billingSvc.syncSubscription().subscribe({
        next: (user) => this.userSvc.cacheProfile(user),
        error: () => undefined,
      });
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

  onPlansScroll(event: Event): void {
    const track = event.currentTarget as HTMLElement;
    const cards = track.querySelectorAll<HTMLElement>('.pricing-plan');
    if (!cards.length) {
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const center = trackRect.left + trackRect.width / 2;
    let best = 0;
    let bestDist = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = index;
      }
    });

    if (this.plansScrollIndex() !== best) {
      this.plansScrollIndex.set(best);
    }
  }

  scrollToPlan(index: number): void {
    const track = this.plansTrack()?.nativeElement;
    if (!track || window.matchMedia('(min-width: 1024px)').matches) {
      return;
    }

    const card = track.querySelectorAll<HTMLElement>('.pricing-plan')[index];
    if (!card) {
      return;
    }

    card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    this.plansScrollIndex.set(index);
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
      if (!this.isProOrTrial() || this.basisDowngradeScheduled()) {
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

    void this.router.navigate(['/app/payment'], {
      queryParams: { plan, interval: this.billingInterval() },
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
