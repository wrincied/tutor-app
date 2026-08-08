import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import type { UserProfile } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './admin-shell.component.html',
  styleUrl: './admin-shell.component.scss',
})
export class AdminShellComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly userSvc = inject(UserService);

  readonly adminProfile = signal<UserProfile | null>(null);

  ngOnInit(): void {
    this.userSvc.refreshProfile().subscribe({
      next: (profile) => this.adminProfile.set(profile),
      error: () => this.adminProfile.set(null),
    });
  }

  signedInLabel(): string {
    const p = this.adminProfile();
    if (!p) {
      return '';
    }
    const email = p.email || '—';
    const plan = String(p.subscription_status || 'free');
    return this.i18n
      .adminUi()
      .signedInAs.replace('{email}', email)
      .replace('{plan}', plan)
      .replace('{uid}', p._id || '');
  }
}
