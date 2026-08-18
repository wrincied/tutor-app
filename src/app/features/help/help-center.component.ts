import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { I18nService } from '../../core/services/i18n.service';
import { PublicContentService } from '../../core/services/public-content.service';
import { RecaptchaService } from '../../shared/recaptcha/recaptcha.service';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [RouterLink, FormsModule, RevealDirective],
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.scss',
})
export class HelpCenterComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly publicContent = inject(PublicContentService);
  private readonly recaptcha = inject(RecaptchaService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
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
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  mailHintText(): string {
    return this.i18n.helpFormUi().mailHint.replace('{email}', this.contactEmail());
  }

  mailtoHref(): string {
    return `mailto:${this.contactEmail()}`;
  }

  openFaq(event: Event): void {
    event.preventDefault();
    void this.router.navigateByUrl('/').then(() => {
      setTimeout(() => {
        document
          .getElementById('landing-v2-faq')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    });
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
          this.name.set('');
          this.email.set('');
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
