import { Component, inject, signal } from '@angular/core';
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
export class VerifyEmailNoticeComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly i18n = inject(I18nService);

  loading = signal(false);
  message = signal('');
  error = signal('');

  readonly email = this.auth.firebaseUser()?.email ?? '';

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
        this.loading.set(false);
        if (user?.emailVerified) {
          this.auth.bootstrapProfile().subscribe({
            next: (profile) => {
              if (user) {
                this.auth.navigateAfterAuth(profile, user);
              }
            },
          });
        } else {
          this.error.set(this.i18n.authUi().verifyNotYet);
        }
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
