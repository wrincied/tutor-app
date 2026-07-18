import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import type { LegalCmsDocId } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';
import { PublicContentService } from '../../core/services/public-content.service';
import { renderSafeMarkdown } from '../../core/utils/safe-markdown';

export type LegalDocumentId = 'data-processing' | 'cookies' | 'impressum';

@Component({
  selector: 'app-legal-document',
  standalone: true,
  imports: [],
  templateUrl: './legal-document.component.html',
  styleUrl: './legal-document.component.scss',
})
export class LegalDocumentComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly publicContent = inject(PublicContentService);
  private readonly sanitizer = inject(DomSanitizer);
  readonly i18n = inject(I18nService);

  readonly cmsTitle = signal('');
  readonly cmsHtml = signal<SafeHtml | null>(null);
  readonly cmsLoading = signal(false);
  readonly cmsError = signal(false);

  goBack(): void {
    this.location.back();
  }

  readonly documentId = computed((): LegalDocumentId => {
    const id = this.route.snapshot.data['doc'] as LegalDocumentId | undefined;
    if (id === 'cookies') return 'cookies';
    if (id === 'impressum') return 'impressum';
    return 'data-processing';
  });

  readonly isCookies = computed(() => this.documentId() === 'cookies');
  readonly isCmsDoc = computed(
    () => this.documentId() === 'data-processing' || this.documentId() === 'impressum',
  );

  ngOnInit(): void {
    if (!this.isCmsDoc()) {
      return;
    }
    const cmsId: LegalCmsDocId =
      this.documentId() === 'impressum' ? 'impressum' : 'datenschutz';
    this.cmsLoading.set(true);
    this.publicContent.getLegal(cmsId).subscribe({
      next: (doc) => {
        this.cmsTitle.set(doc.title);
        this.cmsHtml.set(this.sanitizer.bypassSecurityTrustHtml(renderSafeMarkdown(doc.body)));
        this.cmsLoading.set(false);
      },
      error: () => {
        this.cmsError.set(true);
        this.cmsLoading.set(false);
      },
    });
  }
}
