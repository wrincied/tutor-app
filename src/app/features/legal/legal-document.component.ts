import {
  Component,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import type { LegalCmsDocId } from '@interfaces';
import { I18nService } from '../../core/services/i18n.service';
import { PublicContentService } from '../../core/services/public-content.service';
import { renderSafeMarkdown } from '../../core/utils/safe-markdown';
import { RevealDirective } from '../../shared/reveal/reveal.directive';

export type LegalDocumentId = 'data-processing' | 'cookies' | 'impressum' | 'terms';

@Component({
  selector: 'app-legal-document',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './legal-document.component.html',
  styleUrl: './legal-document.component.scss',
  // CMS body is [innerHTML]; emulated encapsulation never matches those nodes.
  encapsulation: ViewEncapsulation.None,
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
    if (id === 'terms') return 'terms';
    return 'data-processing';
  });

  readonly isCookies = computed(() => this.documentId() === 'cookies');
  readonly isTerms = computed(() => this.documentId() === 'terms');
  readonly isCmsDoc = computed(
    () => this.documentId() === 'data-processing' || this.documentId() === 'impressum',
  );

  readonly termsSections = computed(() => {
    const t = this.i18n.legalTermsUi();
    return [
      { title: t.section1Title, body: t.section1Body },
      { title: t.section2Title, body: t.section2Body },
      { title: t.section3Title, body: t.section3Body },
      { title: t.section4Title, body: t.section4Body },
      { title: t.section5Title, body: t.section5Body },
      { title: t.section6Title, body: t.section6Body },
      { title: t.section7Title, body: t.section7Body },
      { title: t.section8Title, body: t.section8Body },
      { title: t.section9Title, body: t.section9Body },
      { title: t.section10Title, body: t.section10Body },
    ];
  });

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
