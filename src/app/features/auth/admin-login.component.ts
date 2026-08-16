import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import type { User } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { isAdminAllowlistedEmail } from '../../core/utils/brand-email';
import { resolveLoginError } from '../../core/utils/auth-errors';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./auth.scss', './admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  private readonly auth = inject(Auth);
  private readonly authSvc = inject(AuthService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  email = 'admin@simple4u.at';
  password = '';
  loading = signal(false);
  error = signal('');
  info = signal('');

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }
    const isPassword = user.providerData.some((p) => p.providerId === 'password');
    if (isPassword && isAdminAllowlistedEmail(user.email)) {
      void this.finishAdmin(user);
      return;
    }
    this.info.set(
      'Admin requires the admin@simple4u.at email/password account. Your current session will be signed out when you continue.',
    );
  }

  submit(): void {
    this.error.set('');
    this.info.set('');
    const email = this.email.trim().toLowerCase();
    if (!isAdminAllowlistedEmail(email)) {
      this.error.set(this.i18n.authUi().emailAlreadyInUse);
      return;
    }
    if (this.password.length < 6) {
      this.error.set(this.i18n.authUi().passwordMinLength);
      return;
    }
    this.loading.set(true);
    void (async () => {
      try {
        if (this.auth.currentUser) {
          await signOut(this.auth);
        }
        const user = await firstValueFrom(this.authSvc.login(email, this.password));
        await this.finishAdmin(user);
      } catch (err) {
        console.error('[admin-login]', err);
        this.error.set(resolveLoginError(err, this.i18n.authUi()));
        this.loading.set(false);
      }
    })();
  }

  private async finishAdmin(user: User): Promise<void> {
    this.loading.set(true);
    try {
      const profile = await firstValueFrom(this.authSvc.bootstrapProfile());

      const token = await user.getIdTokenResult(true);
      const provider = (
        token.claims['firebase'] as { sign_in_provider?: string } | undefined
      )?.sign_in_provider;
      if (provider !== 'password') {
        this.error.set('Admin access requires email/password sign-in');
        this.loading.set(false);
        return;
      }
      if (!isAdminAllowlistedEmail(user.email || profile.email)) {
        this.error.set(this.i18n.authUi().emailAlreadyInUse);
        this.loading.set(false);
        return;
      }
      if (profile.role !== 'super_admin') {
        this.error.set('This account is not a super admin');
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
