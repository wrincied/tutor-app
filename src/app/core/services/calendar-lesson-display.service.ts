import { Injectable } from '@angular/core';
import type { CalendarLesson, Lesson, Student } from '@interfaces';
import { enrichLessonsWithLastPaidMarker } from '../utils/calendar-last-paid-lesson';

@Injectable({ providedIn: 'root' })
export class CalendarLessonDisplayService {
  /** Обогащение уроков UI-флагом перед отрисовкой сетки календаря. */
  enrichForGrid(lessons: readonly Lesson[], students: readonly Student[]): CalendarLesson[] {
    return enrichLessonsWithLastPaidMarker(lessons, students);
  }
}
