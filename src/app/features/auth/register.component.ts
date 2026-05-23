import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { I18nService } from '../../core/services/i18n.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './auth.scss',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private userSvc = inject(UserService);
  private router = inject(Router);
  readonly i18n = inject(I18nService);

  email = '';
  password = '';
  passwordConfirm = '';
  error = signal('');
  loading = signal(false);

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

  submit() {
    if (this.password !== this.passwordConfirm) {
      this.error.set(this.i18n.authUi().passwordsMismatch);
      return;
    }
    if (this.password.length < 6) {
      this.error.set(this.i18n.authUi().passwordMinLength);
      return;
    }
    this.error.set('');
    this.loading.set(true);
    this.auth.register(this.email, this.password).subscribe({
      next: () => void this.router.navigate(['/app/verify-email-notice']),
      error: (err) => {
        console.error('[Register error]', err);
        this.error.set(err?.message || this.i18n.authUi().registerError);
        this.loading.set(false);
      },
    });
  }
}
