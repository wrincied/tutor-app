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
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import type { UserProfile } from '@interfaces';

@Component({
  selector: 'app-header-profile-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-profile-menu.component.html',
  styleUrl: './header-profile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderProfileMenuComponent {
  private readonly auth = inject(AuthService);
  private readonly userSvc = inject(UserService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);
  readonly i18n = inject(I18nService);

  readonly profile = signal<UserProfile | null>(null);
  readonly menuOpen = signal(false);

  readonly isAdmin = computed(() => this.profile()?.role === 'super_admin');

  readonly avatarLabel = computed(() => {
    const profile = this.profile();
    const first = profile?.first_name?.trim()?.charAt(0) ?? '';
    const last = profile?.last_name?.trim()?.charAt(0) ?? '';
    const initials = `${first}${last}`.toUpperCase();
    return initials || '?';
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
        this.menuOpen.set(false);
      });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.hostContains(target)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuOpen.set(false);
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.menuOpen.set(false);
    this.auth.logout().subscribe();
  }

  private hostContains(node: Node): boolean {
    return this.host.nativeElement.contains(node);
  }
}
