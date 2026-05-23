import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';
import { AppDialogComponent } from '../../shared/app-dialog/app-dialog.component';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, AppDialogComponent],
  templateUrl: './login.component.html',
  styleUrl: './auth.scss',
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private userSvc = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly i18n = inject(I18nService);

  email = '';
  password = '';
  resetModalEmail = '';
  error = signal('');
  loading = signal(false);
  verifySuccess = signal(false);

  resetModalOpen = signal(false);
  resetLoading = signal(false);
  resetModalError = signal('');
  resetModalSuccess = signal(false);

  consentDeclined = signal(false);

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.verifySuccess.set(params.get('verify') === 'success');
      this.consentDeclined.set(params.get('consent') === 'declined');
    });
  }

  submit() {
    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.email, this.password).subscribe({
      next: (user) => {
        this.loading.set(false);
        if (!user.emailVerified) {
          void this.router.navigate(['/app/verify-email-notice']);
          return;
        }
        this.userSvc.ensureProfile().subscribe({
          next: (profile) => this.auth.navigateAfterAuth(profile, user),
          error: () => {
            this.error.set(this.i18n.authUi().wrongCredentials);
          },
        });
      },
      error: (err) => {
        console.error('[Login error]', err);
        this.error.set(this.i18n.authUi().wrongCredentials);
        this.loading.set(false);
      },
    });
  }

  openResetModal(): void {
    this.resetModalEmail = this.email.trim();
    this.resetModalError.set('');
    this.resetModalSuccess.set(false);
    this.resetModalOpen.set(true);
  }

  closeResetModal(): void {
    this.resetModalOpen.set(false);
    this.resetLoading.set(false);
    this.resetModalSuccess.set(false);
    this.resetModalError.set('');
  }

  onResetDialogConfirm(): void {
    if (this.resetModalSuccess()) {
      this.closeResetModal();
      return;
    }
    this.submitResetFromModal();
  }

  signInWithGoogle(): void {
    this.error.set('');
    this.loading.set(true);
    this.auth.loginWithGoogle().subscribe({
      next: (user) => {
        this.loading.set(false);
        if (!user.emailVerified) {
          void this.router.navigate(['/app/verify-email-notice']);
          return;
        }
        this.userSvc.ensureProfile().subscribe({
          next: (profile) => this.auth.navigateAfterAuth(profile, user),
          error: () => {
            this.error.set(this.i18n.authUi().oauthError);
          },
        });
      },
      error: (err) => {
        console.error('[Google sign-in]', err);
        this.error.set(this.i18n.authUi().oauthError);
        this.loading.set(false);
      },
    });
  }

  submitResetFromModal(): void {
    if (this.resetModalSuccess() || this.resetLoading()) {
      return;
    }
    this.resetModalError.set('');
    const normalized = this.resetModalEmail.trim().toLowerCase();
    if (!normalized) {
      this.resetModalError.set(this.i18n.authUi().enterEmailForReset);
      return;
    }
    this.resetLoading.set(true);
    this.auth.sendPasswordReset(normalized).subscribe({
      next: () => {
        this.resetModalSuccess.set(true);
        this.resetLoading.set(false);
        this.email = normalized;
      },
      error: () => {
        this.resetModalError.set(this.i18n.authUi().resetPasswordError);
        this.resetLoading.set(false);
      },
    });
  }
}
