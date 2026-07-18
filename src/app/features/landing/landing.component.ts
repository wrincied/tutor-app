import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { PublicContentService } from '../../core/services/public-content.service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly publicContent = inject(PublicContentService);

  readonly contactEmail = signal('support@simple4u.com');

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
