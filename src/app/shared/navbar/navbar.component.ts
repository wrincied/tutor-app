import { Component, inject, signal, effect, PLATFORM_ID, DestroyRef, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
const SIDEBAR_COLLAPSE_BTN_MAX = 890;

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  auth = inject(AuthService);
  i18n = inject(I18nService);
  private readonly userSvc = inject(UserService);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  collapsed = signal(false);
  isSuperAdmin = signal(false);

  constructor() {
    effect(() => {
      document.documentElement.style.setProperty(
        '--sidebar-w',
        this.collapsed() ? '64px' : '220px',
      );
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

  ngOnInit(): void {
    this.userSvc.ensureProfile().subscribe({
      next: (profile) => this.isSuperAdmin.set(profile.role === 'super_admin'),
      error: () => this.isSuperAdmin.set(false),
    });
  }

  toggle() {
    this.collapsed.update((v) => !v);
  }

  logout(): void {
    this.auth.logout().subscribe();
  }
}
