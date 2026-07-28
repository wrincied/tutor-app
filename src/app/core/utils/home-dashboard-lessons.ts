import type { CalendarLesson, Lesson, Student } from '@interfaces';
import { dayKey } from './day-key';
import { expandLessonsForRange } from './lesson-recurrence';
import type { HomeLessonRow } from './home-dashboard';

function startOfLocalDay(day: Date): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
}

function endOfLocalDay(day: Date): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
}

/** Уроки на выбранный день с учётом повторяющихся серий. */
export function lessonsForDay(
  lessons: readonly Lesson[],
  students: readonly Student[],
  day = new Date(),
): HomeLessonRow[] {
  const start = startOfLocalDay(day);
  const end = endOfLocalDay(day);
  const todayKey = dayKey(day);
  const studentMap = new Map(students.map((student) => [student._id, student]));

  const expanded = expandLessonsForRange([...lessons] as CalendarLesson[], start, end);

  return expanded
    .filter((lesson) => lesson.scheduledAt && dayKey(new Date(lesson.scheduledAt)) === todayKey)
    .sort(
      (left, right) =>
        new Date(left.scheduledAt).getTime() - new Date(right.scheduledAt).getTime(),
    )
    .map((lesson) => {
      const student = lesson.student_id ? studentMap.get(lesson.student_id) : undefined;
      return {
        lesson,
        studentName: student?.name?.trim() || lesson.student_name?.trim() || '—',
        studentColor: student?.color_hex ?? '#94a3b8',
      };
    });
}
