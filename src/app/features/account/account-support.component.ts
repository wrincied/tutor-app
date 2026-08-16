import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { I18nService } from '../../core/services/i18n.service';
import { PublicContentService } from '../../core/services/public-content.service';
import { UserService } from '../../core/services/user.service';
import { RecaptchaService } from '../../shared/recaptcha/recaptcha.service';

@Component({
  selector: 'app-account-support',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './account-support.component.html',
  styleUrls: ['./account-page-host.scss', './account-support.component.scss'],
})
export class AccountSupportComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly publicContent = inject(PublicContentService);
  private readonly userSvc = inject(UserService);
  private readonly recaptcha = inject(RecaptchaService);

  readonly contactEmail = signal('support@simple4u.at');
  readonly name = signal('');
  readonly email = signal('');
  readonly subject = signal('');
  readonly message = signal('');
  readonly submitting = signal(false);
  readonly success = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.recaptcha.warmUp();
    this.publicContent.getContact().subscribe({
      next: (info) => {
        if (info.email) this.contactEmail.set(info.email);
      },
    });
    this.userSvc.ensureProfile().subscribe({
      next: (profile) => {
        if (profile.email && !this.email()) {
          this.email.set(profile.email);
        }
        const fullName = [profile.first_name, profile.last_name]
          .map((p) => String(p || '').trim())
          .filter(Boolean)
          .join(' ');
        if (fullName && !this.name()) {
          this.name.set(fullName);
        }
      },
    });
  }

  mailHintText(): string {
    return this.i18n.helpFormUi().mailHint.replace('{email}', this.contactEmail());
  }

  mailtoHref(): string {
    return `mailto:${this.contactEmail()}`;
  }

  submit(): void {
    this.error.set(null);
    this.success.set(false);
    const t = this.i18n.helpFormUi();
    const name = this.name().trim();
    const email = this.email().trim();
    const subject = this.subject().trim();
    const message = this.message().trim();
    if (!name || !email || !subject || !message) {
      this.error.set(t.error);
      return;
    }
    this.submitting.set(true);
    from(this.recaptcha.execute('contact'))
      .pipe(
        switchMap((recaptchaToken) => {
          if (this.recaptcha.enabled && !recaptchaToken) {
            throw new HttpErrorResponse({
              status: 400,
              error: { code: 'CAPTCHA_FAILED' },
            });
          }
          return this.publicContent.sendContactMessage({
            name,
            email,
            subject,
            message,
            recaptchaToken,
          });
        }),
      )
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.success.set(true);
          this.subject.set('');
          this.message.set('');
        },
        error: (err: unknown) => {
          this.submitting.set(false);
          if (err instanceof HttpErrorResponse && err.status === 429) {
            this.error.set(t.rateLimited);
          } else if (
            err instanceof HttpErrorResponse &&
            err.error?.code === 'CAPTCHA_FAILED'
          ) {
            this.error.set(t.captchaRequired);
          } else {
            this.error.set(t.error);
          }
        },
      });
  }
}
