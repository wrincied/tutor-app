import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { LegalCmsDocId } from '@interfaces';
import { AdminService } from '../../core/services/admin.service';
import { I18nService } from '../../core/services/i18n.service';

@Component({
  selector: 'app-admin-landing',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-landing.component.html',
  styleUrl: './admin-landing.component.scss',
})
export class AdminLandingComponent implements OnInit {
  private readonly admin = inject(AdminService);
  readonly i18n = inject(I18nService);

  readonly activeDoc = signal<LegalCmsDocId>('datenschutz');
  title = '';
  body = '';
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  saved = signal(false);

  ngOnInit(): void {
    this.load(this.activeDoc());
  }

  selectDoc(doc: LegalCmsDocId): void {
    if (doc === this.activeDoc()) {
      return;
    }
    this.activeDoc.set(doc);
    this.load(doc);
  }

  load(doc: LegalCmsDocId): void {
    this.loading.set(true);
    this.error.set('');
    this.saved.set(false);
    this.admin.getLandingLegal(doc).subscribe({
      next: (docData) => {
        this.title = docData.title;
        this.body = docData.body;
        this.loading.set(false);
      },
      error: () => {
        this.error.set(this.i18n.adminUi().landingLoadError);
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.error.set('');
    this.saved.set(false);
    this.admin
      .saveLandingLegal(this.activeDoc(), { title: this.title.trim(), body: this.body })
      .subscribe({
        next: (docData) => {
          this.title = docData.title;
          this.body = docData.body;
          this.saving.set(false);
          this.saved.set(true);
        },
        error: () => {
          this.error.set(this.i18n.adminUi().landingLoadError);
          this.saving.set(false);
        },
      });
  }
}
