import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { LegalCmsDocId, LegalCmsDocument, PublicContactInfo } from '@interfaces';
import { apiUrl } from '../config/api-url';

const API = apiUrl('public');

@Injectable({ providedIn: 'root' })
export class PublicContentService {
  private readonly http = inject(HttpClient);

  getLegal(doc: LegalCmsDocId): Observable<LegalCmsDocument> {
    return this.http.get<LegalCmsDocument>(`${API}/legal/${doc}`);
  }

  getContact(): Observable<PublicContactInfo> {
    return this.http.get<PublicContactInfo>(`${API}/contact`);
  }
}
