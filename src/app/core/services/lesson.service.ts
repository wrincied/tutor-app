import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { Lesson } from '@interfaces';

export type { Lesson } from '@interfaces';

import { apiUrl } from '../config/api-url';

const API = apiUrl('/lessons');

@Injectable({ providedIn: 'root' })
export class LessonService {
  private http = inject(HttpClient);

  /** GET /api/lessons */
  getAll() {
    return this.http.get<(Lesson & { status?: string; createdAt?: string; updatedAt?: string })[]>(
      API,
    );
  }

  /** POST /api/lessons — цена snapshot на сервере из профиля ученика */
  create(payload: {
    student_id: string;
    lesson_duration?: number;
    status?: Lesson['status'];
    notes?: string;
    scheduledAt?: string | null;
    should_deduct_balance?: boolean;
  }) {
    return this.http.post<Lesson>(API, payload);
  }

  /** PUT /api/lessons/:id — снапшот цены только на сервере; при смене student_id переснимается */
  update(
    id: string,
    payload: {
      student_id?: string | null;
      lesson_duration?: number;
      status?: Lesson['status'];
      notes?: string;
      scheduledAt?: string | null;
      should_deduct_balance?: boolean;
    },
  ) {
    return this.http.put<Lesson>(`${API}/${id}`, payload);
  }

  /** POST /api/lessons/:id/cancel-with-billing — атомарная смена статуса и баланса */
  cancelWithBilling(
    id: string,
    payload: {
      student_id?: string;
      status: 'missed' | 'canceled';
      should_deduct_balance: boolean;
    },
  ) {
    return this.http.post<{ lesson: Lesson }>(`${API}/${id}/cancel-with-billing`, payload);
  }

  /** DELETE /api/lessons/:id */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }
}
