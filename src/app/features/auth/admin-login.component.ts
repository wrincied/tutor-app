import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth, GithubAuthProvider, signInWithPopup } from '@angular/fire/auth';
import type { User } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./auth.scss', './admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  private readonly auth = inject(Auth);
  private readonly authSvc = inject(AuthService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  loading = signal(false);
  error = signal('');
  info = signal('');

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }
    const isGithub = user.providerData.some((p) => p.providerId === 'github.com');
    if (isGithub) {
      void this.finishAdmin(user);
    } else {
      this.info.set('Admin requires GitHub sign-in. Sign in with GitHub below.');
    }
  }

  async signInWithGithub(): Promise<void> {
    this.error.set('');
    this.info.set('');
    this.loading.set(true);
    const provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('user:email');
    try {
      const cred = await signInWithPopup(this.auth, provider);
      await this.finishAdmin(cred.user);
    } catch (err) {
      console.error('[admin-login github]', err);
      const code = (err as { code?: string })?.code;
      if (code === 'auth/account-exists-with-different-credential') {
        this.error.set(
          'This email is already linked to another sign-in method. Use the GitHub account that matches your admin allowlist.',
        );
      } else {
        this.error.set(this.i18n.authUi().oauthErrorGithub);
      }
      this.loading.set(false);
    }
  }

  private async finishAdmin(user: User): Promise<void> {
    this.loading.set(true);
    try {
      // Bootstrap may repair allowlisted role → super_admin; always use that response.
      const profile = await firstValueFrom(this.authSvc.bootstrapProfile());

      const token = await user.getIdTokenResult(true);
      const provider = (
        token.claims['firebase'] as { sign_in_provider?: string } | undefined
      )?.sign_in_provider;
      if (provider !== 'github.com') {
        this.error.set('Admin access requires GitHub sign-in');
        this.loading.set(false);
        return;
      }

      if (profile.role !== 'super_admin') {
        this.error.set('This GitHub account is not a super admin');
        this.loading.set(false);
        return;
      }
      this.loading.set(false);
      void this.router.navigate(['/app/admin']);
    } catch (err) {
      console.error('[admin-login finish]', err);
      this.error.set(this.i18n.authUi().profileSyncError);
      this.loading.set(false);
    }
  }
}
