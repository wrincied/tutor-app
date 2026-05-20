import { Component, inject, signal, effect, PLATFORM_ID, DestroyRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import type { Lang } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';

const SIDEBAR_COLLAPSE_BTN_MAX = 890;

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  auth = inject(AuthService);
  i18n = inject(I18nService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  collapsed = signal(false);
  dark = signal(false);

  constructor() {
    effect(() => {
      document.documentElement.style.setProperty(
        '--sidebar-w',
        this.collapsed() ? '64px' : '220px',
      );
    });

    effect(() => {
      document.documentElement.setAttribute('data-theme', this.dark() ? 'dark' : 'light');
    });

    if (isPlatformBrowser(this.platformId)) {
      const mq = window.matchMedia(`(max-width: ${SIDEBAR_COLLAPSE_BTN_MAX}px)`);
      const onBreakpoint = () => {
        if (!mq.matches) this.collapsed.set(false);
      };
      mq.addEventListener('change', onBreakpoint);
      onBreakpoint();
      this.destroyRef.onDestroy(() => mq.removeEventListener('change', onBreakpoint));
    }
  }

  toggle() {
    this.collapsed.update((v) => !v);
  }

  toggleTheme() {
    this.dark.update((v) => !v);
  }

  pickLang(code: Lang, menu: HTMLDetailsElement): void {
    this.i18n.setLang(code);
    menu.open = false;
  }
}
