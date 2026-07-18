import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-verify-email-notice',
  imports: [],
  templateUrl: './verify-email-notice.component.html',
  styleUrl: './auth.scss',
})
export class VerifyEmailNoticeComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly userSvc = inject(UserService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  loading = signal(false);
  message = signal('');
  error = signal('');

  readonly email = this.auth.firebaseUser()?.email ?? '';

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) {
      return;
    }
    const firebaseUser = this.auth.firebaseUser();
    const isGithub = firebaseUser?.providerData.some((p) => p.providerId === 'github.com');
    this.userSvc.ensureProfile().subscribe({
      next: (profile) => {
        if (profile.role === 'super_admin' && isGithub) {
          void this.router.navigate(['/app/admin']);
        }
      },
      error: () => {
        this.error.set(this.i18n.authUi().profileSyncError);
      },
    });
  }

  resend(): void {
    this.loading.set(true);
    this.error.set('');
    this.message.set('');
    this.auth.resendVerificationEmail().subscribe({
      next: () => {
        this.message.set(this.i18n.authUi().checkEmailResent);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.i18n.authUi().checkEmailResendError);
        this.loading.set(false);
      },
    });
  }

  checkVerified(): void {
    this.loading.set(true);
    this.error.set('');
    this.auth.reloadUser().subscribe({
      next: (user) => {
        this.userSvc.ensureProfile().subscribe({
          next: (profile) => {
            this.loading.set(false);
            if (profile.role === 'super_admin') {
              const isGithub = user?.providerData.some((p) => p.providerId === 'github.com');
              if (isGithub) {
                void this.router.navigate(['/app/admin']);
                return;
              }
            }
            if (user?.emailVerified) {
              this.auth.navigateAfterAuth(profile, user);
            } else {
              this.error.set(this.i18n.authUi().verifyNotYet);
            }
          },
          error: () => {
            this.loading.set(false);
            this.error.set(this.i18n.authUi().profileSyncError);
          },
        });
      },
      error: () => {
        this.loading.set(false);
        this.error.set(this.i18n.authUi().verifyFailed);
      },
    });
  }

  signOut(): void {
    this.auth.logout().subscribe();
  }
}
