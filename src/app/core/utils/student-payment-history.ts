import type { ActivityLogEntry, RateCurrency } from '@interfaces';
import { formatMoneyWithCode } from './format-currency';

export type StudentPaymentHistoryRow = {
  id: string;
  amountLabel: string;
  dateLabel: string;
  dateIso: string;
};

export type StudentLastTopupLike = {
  at?: string | null;
  amount_money?: number | null;
  currency?: string | null;
} | null | undefined;

function formatPaymentDate(iso: string, localeId: string): string {
  const raw = String(iso ?? '').trim();
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) {
    return raw;
  }
  return d.toLocaleDateString(localeId, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function rowFromTopupEntry(
  entry: ActivityLogEntry,
  localeId: string,
): StudentPaymentHistoryRow | null {
  const meta = entry.metadata ?? {};
  const amount = Number(meta['money_amount']);
  const currency = String(meta['currency'] || 'EUR') as RateCurrency;
  const paidAt = String(meta['paid_at'] || entry.createdAt || '').trim();
  if (!Number.isFinite(amount) || !paidAt) {
    return null;
  }
  return {
    id: entry._id,
    amountLabel: formatMoneyWithCode(amount, currency, localeId),
    dateLabel: formatPaymentDate(paidAt, localeId),
    dateIso: paidAt.slice(0, 10),
  };
}

function fallbackFromLastTopup(
  studentId: string,
  lastTopup: StudentLastTopupLike,
  localeId: string,
): StudentPaymentHistoryRow[] {
  if (!lastTopup?.at) {
    return [];
  }
  return [
    {
      id: `last-${studentId}`,
      amountLabel: formatMoneyWithCode(
        Number(lastTopup.amount_money) || 0,
        (lastTopup.currency || 'EUR') as RateCurrency,
        localeId,
      ),
      dateLabel: formatPaymentDate(String(lastTopup.at), localeId),
      dateIso: String(lastTopup.at).slice(0, 10),
    },
  ];
}

/** Build top-up payment history for a student from activity logs (+ last_topup fallback). */
export function buildStudentPaymentHistory(
  entries: ActivityLogEntry[],
  studentId: string,
  lastTopup: StudentLastTopupLike,
  localeId: string,
  limit = 30,
): StudentPaymentHistoryRow[] {
  const rows = entries
    .filter(
      (e) =>
        e.action === 'student.topup' && String(e.entity_id ?? '') === String(studentId),
    )
    .map((e) => rowFromTopupEntry(e, localeId))
    .filter((row): row is StudentPaymentHistoryRow => row !== null);

  if (rows.length > 0) {
    return rows.slice(0, limit);
  }
  return fallbackFromLastTopup(studentId, lastTopup, localeId).slice(0, limit);
}
