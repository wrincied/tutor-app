import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { PublicContentService } from '../../core/services/public-content.service';
import { LocaleRouter } from '../../core/i18n/locale-router.service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly localeRouter = inject(LocaleRouter);
  /** Locale-aware absolute path for routerLink. */
  lp(path: string): string {
    return this.localeRouter.path(path);
  }
  private readonly publicContent = inject(PublicContentService);

  readonly contactEmail = signal('support@simple4u.at');

  ngOnInit(): void {
    this.publicContent.getContact().subscribe({
      next: (info) => {
        if (info.email) {
          this.contactEmail.set(info.email);
        }
      },
      error: () => {
        /* keep default */
      },
    });
  }
}
