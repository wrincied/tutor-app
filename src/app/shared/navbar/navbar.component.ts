import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import type { Lang } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  auth = inject(AuthService);
  i18n = inject(I18nService);
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
  }

  // toggleSidebar() {

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
