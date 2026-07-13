import { describe, expect, it } from 'vitest';
import type { Lesson, Student } from '@interfaces';
import {
  findNextLesson,
  lessonsForDay,
  overdueLessonCount,
  studentsLowBalance,
} from './home-dashboard';

describe('home-dashboard', () => {
  const students: Student[] = [
    {
      _id: 's1',
      name: 'Anna',
      rate_per_hour: 30,
      color_hex: '#f00',
      balance_lessons: 0,
      timezone: 'Europe/Vienna',
      auto_debit_enabled: true,
      bot_active: false,
      createdAt: '2026-01-01',
    },
    {
      _id: 's2',
      name: 'Max',
      rate_per_hour: 25,
      color_hex: '#0f0',
      balance_lessons: 5,
      billing_type: 'postpaid',
      timezone: 'Europe/Vienna',
      auto_debit_enabled: true,
      bot_active: false,
      createdAt: '2026-01-01',
    },
  ];

  const lessons: Lesson[] = [
    {
      _id: 'l1',
      student_id: 's1',
      status: 'completed',
      scheduledAt: '2026-07-13T08:00:00.000Z',
      lesson_duration: 60,
      lesson_price: 30,
      lesson_currency: 'EUR',
      reminder_sent: false,
    },
    {
      _id: 'l2',
      student_id: 's1',
      status: 'scheduled',
      scheduledAt: '2026-07-13T14:00:00.000Z',
      lesson_duration: 45,
      lesson_price: 30,
      lesson_currency: 'EUR',
      reminder_sent: false,
    },
  ];

  it('collects lessons for a day sorted by time', () => {
    const day = new Date(2026, 6, 13, 12, 0, 0);
    const rows = lessonsForDay(lessons, students, day);
    expect(rows).toHaveLength(2);
    expect(rows[0]?.studentName).toBe('Anna');
    expect(rows[0]?.lesson.scheduledAt).toBe('2026-07-13T08:00:00.000Z');
  });

  it('finds next scheduled lesson', () => {
    const day = new Date(2026, 6, 13, 12, 0, 0);
    const rows = lessonsForDay(lessons, students, day);
    const next = findNextLesson(rows, new Date('2026-07-13T10:00:00.000Z'));
    expect(next?.lesson._id).toBe('l2');
  });

  it('counts overdue scheduled lessons', () => {
    const day = new Date(2026, 6, 13, 12, 0, 0);
    const rows = lessonsForDay(lessons, students, day);
    expect(overdueLessonCount(rows, new Date('2026-07-13T13:00:00.000Z'))).toBe(0);
    expect(overdueLessonCount(rows, new Date('2026-07-13T15:00:00.000Z'))).toBe(1);
  });

  it('lists prepaid students with low balance only', () => {
    const low = studentsLowBalance(students);
    expect(low).toHaveLength(1);
    expect(low[0]?.name).toBe('Anna');
  });
});
