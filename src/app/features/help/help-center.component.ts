import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { PublicContentService } from '../../core/services/public-content.service';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.scss',
})
export class HelpCenterComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly publicContent = inject(PublicContentService);
  private readonly router = inject(Router);
  readonly contactEmail = signal('support@simple4u.com');

  ngOnInit(): void {
    this.publicContent.getContact().subscribe({
      next: (info) => {
        if (info.email) this.contactEmail.set(info.email);
      },
      error: () => {},
    });
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
}
