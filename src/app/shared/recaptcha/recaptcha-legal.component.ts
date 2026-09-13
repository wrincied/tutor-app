import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { RecaptchaService } from './recaptcha.service';

@Component({
  selector: 'app-recaptcha-legal',
  standalone: true,
  template: `
    @if (recaptcha.enabled) {
      <p class="recaptcha-legal">
        {{ i18n.helpFormUi().captchaLegalPrefix }}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          >{{ i18n.helpFormUi().captchaPrivacy }}</a
        >
        {{ i18n.helpFormUi().captchaLegalMid }}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          >{{ i18n.helpFormUi().captchaTerms }}</a
        >
        {{ i18n.helpFormUi().captchaLegalSuffix }}
      </p>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .recaptcha-legal {
      margin: 0;
      font-size: 0.75rem;
      line-height: 1.45;
      font-weight: 400;
      color: var(--text-secondary, #64748b);
    }

    .recaptcha-legal a {
      color: inherit;
      text-decoration: underline;
      text-underline-offset: 2px;
    }

    .recaptcha-legal a:hover {
      color: var(--moss, #0f3d34);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecaptchaLegalComponent {
  readonly i18n = inject(I18nService);
  readonly recaptcha = inject(RecaptchaService);
}
