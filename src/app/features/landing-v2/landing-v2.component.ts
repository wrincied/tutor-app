import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { Lang } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';
import { MarketingConsentService } from '../../core/services/marketing-consent.service';
import { PublicContentService } from '../../core/services/public-content.service';
import { SystemStatusService } from '../../core/services/system-status.service';
import { getPlanPricing } from '../../core/utils/subscription-pricing';

const DEMO_AUTOPLAY_MS = 10_000;

export type LandingBillingInterval = 'monthly' | 'yearly';

/** Design-only landing preview. Shown at `/` when designMode is on. */
@Component({
  selector: 'app-landing-v2',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing-v2.component.html',
  styleUrl: './landing-v2.component.scss',
})
export class LandingV2Component implements OnInit, OnDestroy {
  readonly i18n = inject(I18nService);
  readonly consent = inject(MarketingConsentService);
  readonly systemStatus = inject(SystemStatusService);
  private readonly publicContent = inject(PublicContentService);
  private readonly router = inject(Router);
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly contactEmail = signal('support@simple4u.com');
  readonly demoSlide = signal(0);
  readonly demoSlideCount = 3;
  readonly langMenuOpen = signal(false);
  readonly billingInterval = signal<LandingBillingInterval>('monthly');
  readonly currentLangCode = computed(() => this.i18n.lang().toUpperCase());

  /** Landing teaser uses AT pricing (primary market). */
  private readonly landingProPricing = computed(() => getPlanPricing('pro', 'AT'));
  private readonly landingBasisPricing = computed(() => getPlanPricing('basis', 'AT'));

  readonly pricingCurrency = computed(() => this.landingProPricing().currency);

  /** Display symbol for AT marketing (€ instead of EUR). */
  readonly pricingCurrencySymbol = computed(() => {
    const code = this.pricingCurrency();
    return code === 'EUR' ? '€' : code;
  });

  readonly freeAmountLabel = computed(() => this.formatAmount(0));

  readonly basisAmountLabel = computed(() => {
    const p = this.landingBasisPricing();
    const amount = this.billingInterval() === 'yearly' ? p.yearly / 12 : p.monthly;
    return this.formatAmount(amount);
  });

  /** Large price: monthly rate, or yearly÷12 when Yearly is selected. */
  readonly proAmountLabel = computed(() => {
    const p = this.landingProPricing();
    const amount = this.billingInterval() === 'yearly' ? p.yearly / 12 : p.monthly;
    return this.formatAmount(amount);
  });

  /** Always “per month” under the large amount (Variant A). */
  readonly proPeriodLabel = computed(() => this.i18n.authUi().landingPricingProPeriodMonthly);

  readonly basisBilledAnnuallyLabel = computed(() => {
    if (this.billingInterval() !== 'yearly') return null;
    const p = this.landingBasisPricing();
    return this.i18n
      .authUi()
      .landingPricingBilledAnnually.replace('{amount}', this.formatAmount(p.yearly))
      .replace('{currency}', this.pricingCurrencySymbol());
  });

  /** Small annual total line — only in Yearly mode. */
  readonly proBilledAnnuallyLabel = computed(() => {
    if (this.billingInterval() !== 'yearly') return null;
    const p = this.landingProPricing();
    return this.i18n
      .authUi()
      .landingPricingBilledAnnually.replace('{amount}', this.formatAmount(p.yearly))
      .replace('{currency}', this.pricingCurrencySymbol());
  });

  private pointerStartX: number | null = null;
  private autoplayId: ReturnType<typeof setInterval> | null = null;

  setBillingInterval(interval: LandingBillingInterval): void {
    this.billingInterval.set(interval);
  }

  scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    void this.router.navigateByUrl('/').then(() => {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    });
  }

  openCookieSettings(): void {
    this.consent.openPreferences();
  }

  private formatAmount(amount: number): string {
    const fractionDigits = Number.isFinite(amount) && !Number.isInteger(amount) ? 2 : 0;
    return new Intl.NumberFormat(this.i18n.localeId(), {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(amount);
  }

  /** Stack depth relative to the active slide (0 = front). */
  demoStack(index: number): 0 | 1 | 2 {
    const cur = this.demoSlide();
    const n = this.demoSlideCount;
    return ((index - cur + n) % n) as 0 | 1 | 2;
  }

  ngOnInit(): void {
    this.systemStatus.refresh();
    this.publicContent.getContact().subscribe({
      next: (info) => {
        if (info.email) {
          this.contactEmail.set(info.email);
        }
      },
      error: () => {
        /* keep default */
      },
    });
    this.startDemoAutoplay();
  }

  footerStatusClass(): string {
    const overall = this.systemStatus.overall();
    if (this.systemStatus.loading() && overall === 'unknown') {
      return 'landing-v2__footer-status landing-v2__footer-status--loading';
    }
    return `landing-v2__footer-status landing-v2__footer-status--${overall}`;
  }

  footerStatusLabel(): string {
    const t = this.i18n.authUi();
    switch (this.systemStatus.overall()) {
      case 'ok':
        return t.footerStatusLive;
      case 'degraded':
        return t.statusDegraded;
      case 'error':
        return t.statusOutage;
      default:
        return this.systemStatus.loading() ? t.statusChecking : t.statusUnknown;
    }
  }

  ngOnDestroy(): void {
    this.stopDemoAutoplay();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.langMenuOpen()) {
      return;
    }
    const langRoot = this.host.nativeElement.querySelector('.landing-v2__lang');
    const target = event.target as Node | null;
    if (langRoot && target && !langRoot.contains(target)) {
      this.langMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.langMenuOpen.set(false);
  }

  toggleLangMenu(): void {
    this.langMenuOpen.update((open) => !open);
  }

  pickLang(lang: Lang): void {
    this.i18n.setLang(lang);
    this.langMenuOpen.set(false);
  }

  isLang(lang: Lang): boolean {
    return this.i18n.lang() === lang;
  }

  setDemoSlide(index: number, restartAutoplay = true): void {
    const next = ((index % this.demoSlideCount) + this.demoSlideCount) % this.demoSlideCount;
    this.demoSlide.set(next);
    if (restartAutoplay) {
      this.startDemoAutoplay();
    }
  }

  onSideSlideClick(index: number): void {
    if (this.demoStack(index) === 0) {
      return;
    }
    this.setDemoSlide(index);
  }

  onDemoPointerDown(event: PointerEvent): void {
    this.pointerStartX = event.clientX;
  }

  onDemoPointerUp(event: PointerEvent): void {
    if (this.pointerStartX === null) {
      return;
    }
    const dx = event.clientX - this.pointerStartX;
    this.pointerStartX = null;
    if (Math.abs(dx) < 40) {
      return;
    }
    this.setDemoSlide(this.demoSlide() + (dx < 0 ? 1 : -1));
  }

  onDemoPointerCancel(): void {
    this.pointerStartX = null;
  }

  private startDemoAutoplay(): void {
    this.stopDemoAutoplay();
    if (typeof window === 'undefined') {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    this.autoplayId = setInterval(() => {
      this.setDemoSlide(this.demoSlide() + 1, false);
    }, DEMO_AUTOPLAY_MS);
  }

  private stopDemoAutoplay(): void {
    if (this.autoplayId !== null) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }
}
