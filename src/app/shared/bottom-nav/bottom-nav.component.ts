import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import type { UserProfile } from '@interfaces';

const MORE_ROUTES = ['/app/workspace', '/app/account', '/app/admin', '/app/pricing'];

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BottomNavComponent {
  private readonly auth = inject(AuthService);
  private readonly userSvc = inject(UserService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly i18n = inject(I18nService);

  readonly profile = signal<UserProfile | null>(null);
  readonly moreOpen = signal(false);

  readonly isAdmin = computed(() => this.profile()?.role === 'super_admin');

  readonly isMoreRouteActive = computed(() => {
    const url = this.router.url.split('?')[0] ?? '';
    return MORE_ROUTES.some((route) => url === route || url.startsWith(`${route}/`));
  });

  constructor() {
    this.userSvc
      .ensureProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => this.profile.set(profile),
        error: () => this.profile.set(null),
      });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.moreOpen.set(false);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.moreOpen()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.host.nativeElement.contains(target)) {
      this.moreOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.moreOpen.set(false);
  }

  toggleMore(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.moreOpen.update((open) => !open);
  }

  closeMore(): void {
    this.moreOpen.set(false);
  }

  logout(): void {
    this.moreOpen.set(false);
    this.auth.logout().subscribe();
  }
}
