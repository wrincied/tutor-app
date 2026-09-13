import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, type Observable, Subscription } from 'rxjs';
import { I18nService } from '../../core/services/i18n.service';
import { AuthService } from '../../core/services/auth.service';
import { LocaleRouter } from '../../core/i18n/locale-router.service';
import type { CanComponentDeactivate } from '../../core/guards/can-deactivate.guard';
import { AccountCustomizationComponent } from './account-customization.component';
import { AccountProfileComponent } from './account-profile.component';
import { AccountSupportComponent } from './account-support.component';

type AccountSectionId = 'acc-customization' | 'acc-profile' | 'acc-support';

const SECTION_BY_PATH: Record<string, AccountSectionId> = {
  customization: 'acc-customization',
  profile: 'acc-profile',
  support: 'acc-support',
  administration: 'acc-profile',
};

const PATH_BY_SECTION: Record<AccountSectionId, string> = {
  'acc-customization': 'customization',
  'acc-profile': 'profile',
  'acc-support': 'support',
};

@Component({
  selector: 'app-account-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    AccountCustomizationComponent,
    AccountProfileComponent,
    AccountSupportComponent,
  ],
  templateUrl: './account-shell.component.html',
  styleUrls: ['./account-shell.component.scss', './account.component.scss'],
})
export class AccountShellComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly localeRouter = inject(LocaleRouter);
  private readonly authSvc = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly injector = inject(Injector);
  readonly i18n = inject(I18nService);

  @ViewChild('anchorsNav') anchorsNav?: ElementRef<HTMLElement>;
  @ViewChild(AccountProfileComponent) profileCmp?: AccountProfileComponent;

  activeSection = signal<AccountSectionId>('acc-customization');

  private routerSub: Subscription | null = null;
  private sectionScrollCleanup: (() => void) | null = null;
  /** Skip one URL→scroll sync after a click-driven navigation. */
  private skipNextUrlScroll = false;

  lp(path: string): string {
    return this.localeRouter.path(path);
  }

  ngOnInit(): void {
    const billing =
      this.route.snapshot.queryParamMap.get('billing') ??
      this.route.parent?.snapshot.queryParamMap.get('billing');
    if (billing === 'success' || billing === 'cancel') {
      void this.localeRouter.navigate('/app/pricing', {
        queryParams: { billing },
        replaceUrl: true,
      });
      return;
    }

    this.routerSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const section = this.sectionFromUrl();
        this.activeSection.set(section);
        this.scrollActiveAnchorIntoView(section);
        if (this.skipNextUrlScroll) {
          this.skipNextUrlScroll = false;
          return;
        }
        requestAnimationFrame(() => this.scrollBodyToSection(section));
      });

    afterNextRender(
      () => {
        this.setupSectionObserver();
        const section = this.sectionFromUrl();
        this.activeSection.set(section);
        this.scrollActiveAnchorIntoView(section);
        this.scrollBodyToSection(section);
      },
      { injector: this.injector },
    );
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
    this.teardownSectionObserver();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.profileCmp?.canDeactivate() ?? true;
  }

  logout(): void {
    this.authSvc.logout().subscribe();
  }

  scrollToSection(id: AccountSectionId, event?: Event): void {
    event?.preventDefault();
    this.activeSection.set(id);
    this.scrollActiveAnchorIntoView(id);
    this.scrollBodyToSection(id);
    this.skipNextUrlScroll = true;
    void this.localeRouter.navigate(`/app/account/${PATH_BY_SECTION[id]}`, {
      replaceUrl: true,
    });
  }

  private sectionFromUrl(): AccountSectionId {
    const url = this.router.url.split('?')[0].split('#')[0];
    const parts = url.split('/').filter(Boolean);
    const accountIdx = parts.lastIndexOf('account');
    const slug = accountIdx >= 0 ? parts[accountIdx + 1] : '';
    return SECTION_BY_PATH[slug || ''] ?? 'acc-customization';
  }

  private scrollBodyToSection(id: AccountSectionId): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const body = this.host.nativeElement.querySelector(
      '.account-page__body',
    ) as HTMLElement | null;
    const el = document.getElementById(id);
    if (!body || !el) {
      return;
    }
    const top =
      body.scrollTop + (el.getBoundingClientRect().top - body.getBoundingClientRect().top);
    body.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
  }

  private scrollActiveAnchorIntoView(id: AccountSectionId): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const nav = this.anchorsNav?.nativeElement;
    if (!nav) {
      return;
    }
    const btn = nav.querySelector(`[data-section="${id}"]`) as HTMLElement | null;
    if (!btn) {
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const delta =
      btnRect.left + btnRect.width / 2 - (navRect.left + navRect.width / 2);
    if (Math.abs(delta) < 8) {
      return;
    }
    nav.scrollBy({ left: delta, behavior: 'smooth' });
  }

  private setupSectionObserver(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.teardownSectionObserver();
    const body = this.host.nativeElement.querySelector(
      '.account-page__body',
    ) as HTMLElement | null;
    if (!body) {
      return;
    }
    const ids: AccountSectionId[] = ['acc-customization', 'acc-profile', 'acc-support'];
    const onScroll = (): void => {
      const marker = body.scrollTop + 24;
      let current: AccountSectionId = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) {
          continue;
        }
        const top =
          body.scrollTop + (el.getBoundingClientRect().top - body.getBoundingClientRect().top);
        if (top <= marker) {
          current = id;
        }
      }
      if (body.scrollTop + body.clientHeight >= body.scrollHeight - 32) {
        current = ids[ids.length - 1];
      }
      if (this.activeSection() === current) {
        return;
      }
      this.activeSection.set(current);
      this.scrollActiveAnchorIntoView(current);
    };
    body.addEventListener('scroll', onScroll, { passive: true });
    this.sectionScrollCleanup = () => body.removeEventListener('scroll', onScroll);
  }

  private teardownSectionObserver(): void {
    this.sectionScrollCleanup?.();
    this.sectionScrollCleanup = null;
  }
}
