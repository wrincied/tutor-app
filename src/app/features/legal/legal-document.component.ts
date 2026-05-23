import { Component, computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';

export type LegalDocumentId = 'data-processing' | 'cookies';

@Component({
  selector: 'app-legal-document',
  standalone: true,
  imports: [],
  templateUrl: './legal-document.component.html',
  styleUrl: './legal-document.component.scss',
})
export class LegalDocumentComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  readonly i18n = inject(I18nService);

  goBack(): void {
    this.location.back();
  }

  readonly documentId = computed((): LegalDocumentId => {
    const id = this.route.snapshot.data['doc'] as LegalDocumentId | undefined;
    return id === 'cookies' ? 'cookies' : 'data-processing';
  });

  readonly isCookies = computed(() => this.documentId() === 'cookies');
}
