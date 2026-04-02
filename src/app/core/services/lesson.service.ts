import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { Lesson } from '@interfaces';

export type { Lesson } from '@interfaces';

const API = 'http://localhost:3001/api/lessons';

@Injectable({ providedIn: 'root' })
export class LessonService {
  private http = inject(HttpClient);

  /** GET /api/lessons */
  getAll() {
    return this.http.get<Lesson[]>(API);
  }

  /** POST /api/lessons */
  create(payload: {
    student_id?: string | null;
    lesson_price: number;
    lesson_duration?: number;
    status?: Lesson['status'];
    title?: string;
    notes?: string;
    scheduledAt?: string | null;
  }) {
    return this.http.post<Lesson>(API, payload);
  }

  /** PUT /api/lessons/:id */
  update(
    id: string,
    payload: {
      student_id?: string | null;
      lesson_price: number;
      lesson_duration?: number;
      status?: Lesson['status'];
      title?: string;
      notes?: string;
      scheduledAt?: string | null;
    },
  ) {
    return this.http.put<Lesson>(`${API}/${id}`, payload);
  }

  /** DELETE /api/lessons/:id */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/${id}`);
  }
}
