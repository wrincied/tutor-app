import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import type { UserProfile } from '@interfaces';
import { BillingService } from '../../core/services/billing.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import { markBillingCheckoutPending } from '../../core/utils/billing-return';
import {
  paymentProviderForCountry,
  resolvePaymentProvider,
  type PaymentProviderId,
} from '../../core/utils/payment-provider';
import { getPlanPricing } from '../../core/utils/subscription-pricing';
import {
  canPurchaseSubscription,
  isTaxModeConfigured,
  resolvePricingCountry,
} from '../../core/utils/user-profile.utils';

type CheckoutPlan = 'basis' | 'pro';
type BillingInterval = 'monthly' | 'yearly';

const TRIAL_DAYS: Record<PaymentProviderId, number> = {
  tribute: 7,
  stripe: 7,
};

function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userSvc = inject(UserService);
  private readonly billingSvc = inject(BillingService);
  readonly i18n = inject(I18nService);

  private pollSub: Subscription | null = null;

  readonly loading = signal(true);
  readonly paying = signal(false);
  readonly error = signal<string | null>(null);
  readonly profile = signal<UserProfile | null>(null);
  readonly tributeReady = signal(false);
  readonly stripeReady = signal(true);
  readonly selectedProvider = signal<PaymentProviderId>('stripe');
  readonly preferredProvider = signal<PaymentProviderId>('stripe');
  readonly consentAccepted = signal(false);

  readonly plan = signal<CheckoutPlan>('pro');
  readonly interval = signal<BillingInterval>('monthly');

  readonly t = computed(() => this.i18n.paymentUi());

  readonly country = computed(() =>
    resolvePricingCountry(this.profile()?.tax_mode, this.profile()?.country_settings),
  );

  readonly fallbackUsed = computed(
    () => this.preferredProvider() === 'tribute' && this.selectedProvider() === 'stripe',
  );

  readonly hasTrial = computed(() => this.plan() === 'pro');

  readonly trialDays = computed(() => TRIAL_DAYS[this.selectedProvider()]);

  readonly taxOk = computed(() => {
    const profile = this.profile();
    return profile?.tax_mode_configured ?? isTaxModeConfigured(profile?.tax_mode);
  });

  readonly canPay = computed(() => {
    if (
      !this.consentAccepted() ||
      !this.profile() ||
      !this.taxOk() ||
      !canPurchaseSubscription(this.profile())
    ) {
      return false;
    }
    return this.providerEnabled(this.selectedProvider());
  });

  readonly pricing = computed(() => getPlanPricing(this.plan(), this.country()));

  readonly amountLabel = computed(() => this.formatAmount(this.planAmount()));

  readonly zeroLabel = computed(() => this.formatAmount(0));

  readonly dueTodayText = computed(() => {
    const t = this.t();
    const amount = this.hasTrial() ? this.zeroLabel() : this.amountLabel();
    return fill(t.dueToday, { amount, currency: this.pricing().currency });
  });

  readonly thenAfterTrialText = computed(() => {
    if (!this.hasTrial()) {
      return null;
    }
    const t = this.t();
    const period = this.interval() === 'yearly' ? t.periodYear : t.periodMonth;
    return fill(t.thenAfterTrial, {
      amount: this.amountLabel(),
      currency: this.pricing().currency,
      period,
      days: this.trialDays(),
    });
  });

  readonly timelineTodayText = computed(() =>
    fill(this.t().timelineToday, { days: this.trialDays() }),
  );

  readonly timelineChargeText = computed(() =>
    fill(this.t().timelineCharge, {
      days: this.trialDays(),
      amount: this.amountLabel(),
      currency: this.pricing().currency,
    }),
  );

  readonly ctaLabel = computed(() => {
    const t = this.t();
    if (this.hasTrial()) {
      return fill(t.payCtaTrial, { days: this.trialDays() });
    }
    return fill(t.payCtaPayNow, {
      amount: this.amountLabel(),
      currency: this.pricing().currency,
    });
  });

  readonly planTitle = computed(
    () => `${this.t().planPrefix} ${this.plan() === 'basis' ? 'Basis' : 'Pro'}`,
  );

  /** Stripe acceptance marks. SEPA only for EUR (Stripe shows SEPA Debit for euro only). */
  readonly stripeMethodMarks = computed(() => {
    const labels = this.t().stripeBadges;
    const marks: Array<{ id: 'visa' | 'mastercard' | 'sepa'; label: string; icon: string }> = [
      { id: 'visa', label: labels[0] ?? 'Visa', icon: 'assets/payment/visa.svg' },
      {
        id: 'mastercard',
        label: labels[1] ?? 'Mastercard',
        icon: 'assets/payment/mastercard.svg',
      },
    ];
    if (this.pricing().currency === 'EUR') {
      marks.push({
        id: 'sepa',
        label: labels[2] ?? 'SEPA',
        icon: 'assets/payment/sepa.svg',
      });
    }
    return marks;
  });

  ngOnInit(): void {
    const q = this.route.snapshot.queryParamMap;
    this.plan.set(q.get('plan') === 'basis' ? 'basis' : 'pro');
    this.interval.set(q.get('interval') === 'yearly' ? 'yearly' : 'monthly');

    if (q.get('billing') === 'success') {
      this.startSuccessPoll();
    }

    this.userSvc.getProfile().subscribe({
      next: (user) => {
        this.profile.set(user);
        const preferred = paymentProviderForCountry(this.country());
        this.preferredProvider.set(preferred);
        this.selectedProvider.set(
          resolvePaymentProvider(this.country(), {
            tributeReady: false,
            stripeReady: true,
          }),
        );
        this.loading.set(false);
        this.billingSvc.getPaymentOptions(this.plan()).subscribe({
          next: (opts) => {
            this.tributeReady.set(opts.tributeReady);
            this.stripeReady.set(opts.stripeReady);
            this.preferredProvider.set(
              opts.preferredProvider ?? paymentProviderForCountry(opts.country),
            );
            this.selectedProvider.set(
              opts.provider ??
                resolvePaymentProvider(opts.country, {
                  tributeReady: opts.tributeReady,
                  stripeReady: opts.stripeReady,
                }),
            );
          },
          error: () => undefined,
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set(this.t().loadError);
      },
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  providerEnabled(id: PaymentProviderId): boolean {
    return id === 'tribute' ? this.tributeReady() : this.stripeReady();
  }

  onConsentChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.consentAccepted.set(!!input.checked);
  }

  pay(): void {
    if (!this.canPay() || this.paying()) {
      return;
    }
    if (!this.consentAccepted()) {
      return;
    }
    const provider = this.selectedProvider();
    if (provider === 'tribute' && !this.tributeReady()) {
      this.error.set(this.t().tributeNotReady);
      return;
    }
    if (provider === 'stripe' && !this.stripeReady()) {
      this.error.set(this.t().stripeNotReady);
      return;
    }
    this.paying.set(true);
    this.error.set(null);
    const req =
      provider === 'tribute'
        ? this.billingSvc.createTributeCheckoutSession(this.interval(), this.plan())
        : this.billingSvc.createCheckoutSession(this.interval(), this.plan());
    req.subscribe({
      next: ({ url }) => {
        this.paying.set(false);
        if (url) {
          markBillingCheckoutPending();
          window.location.href = url;
        }
      },
      error: (err) => {
        this.paying.set(false);
        this.error.set(err?.error?.message ?? this.t().payError);
      },
    });
  }

  private planAmount(): number {
    const p = this.pricing();
    return this.interval() === 'yearly' ? p.yearly : p.monthly;
  }

  private formatAmount(amount: number): string {
    const fraction = Number.isFinite(amount) && !Number.isInteger(amount) ? 2 : 0;
    return new Intl.NumberFormat(this.i18n.localeId(), {
      minimumFractionDigits: fraction,
      maximumFractionDigits: fraction,
    }).format(amount);
  }

  private startSuccessPoll(): void {
    this.userSvc.invalidateProfile();
    this.billingSvc.syncSubscription().subscribe({
      next: (user) => {
        this.userSvc.cacheProfile(user);
        this.profile.set(user);
      },
      error: () => undefined,
    });
    this.pollSub = timer(0, 2000)
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
            this.pollSub?.unsubscribe();
            void this.router.navigate(['/app/home'], { queryParams: { billing: 'success' } });
          }
        },
      });
  }
}
