import type { ActivityLogEntry, ActivityLogStrings } from '@interfaces';

function formatValue(field: string, value: unknown, strings: ActivityLogStrings): string {
  if (value == null || value === '') {
    return '—';
  }
  if (field === 'bot_active') {
    return value ? strings.valueOn : strings.valueOff;
  }
  if (field === 'billing_type') {
    return value === 'postpaid' ? strings.valuePostpaid : strings.valuePackage;
  }
  if (field === 'auto_debit_enabled') {
    return value ? strings.valueOn : strings.valueOff;
  }
  if (field === 'rate_per_hour') {
    return String(value);
  }
  return String(value);
}

function fieldLabel(field: string, strings: ActivityLogStrings): string {
  switch (field) {
    case 'name':
      return strings.fieldName;
    case 'rate_per_hour':
      return strings.fieldRate;
    case 'rate_currency':
      return strings.fieldRateCurrency;
    case 'timezone':
      return strings.fieldTimezone;
    case 'bot_active':
      return strings.fieldBotActive;
    case 'balance_lessons':
      return strings.fieldBalanceLessons;
    case 'billing_type':
      return strings.fieldBillingType;
    case 'credit_limit':
      return strings.fieldCreditLimit;
    case 'auto_debit_enabled':
      return strings.fieldAutoDebit;
    case 'color_hex':
      return strings.fieldColor;
    case 'title':
      return strings.fieldExpenseTitle;
    case 'amount':
      return strings.fieldExpenseAmount;
    case 'expense_date':
      return strings.fieldExpenseDate;
    case 'category':
      return strings.fieldExpenseCategory;
    default:
      return field;
  }
}

function balanceReasonLabel(reason: string | undefined, strings: ActivityLogStrings): string {
  switch (reason) {
    case 'lesson_completed_delayed':
      return strings.reasonLessonCompleted;
    case 'lesson_completed_postpaid':
      return strings.reasonLessonPostpaid;
    case 'lesson_missed_deduct':
      return strings.reasonLessonMissed;
    case 'lesson_canceled_deduct':
      return strings.reasonLessonCanceled;
    case 'lesson_balance_refund':
    case 'lesson_uncompleted_refund':
      return strings.reasonLessonRefund;
    case 'lesson_uncompleted_postpaid_reversal':
      return strings.reasonLessonUncompleted;
    case 'lesson_deleted_refund':
      return strings.reasonLessonDeleted;
    default:
      return reason ?? '';
  }
}

export function formatActivityLogTitle(entry: ActivityLogEntry, strings: ActivityLogStrings): string {
  const meta = entry.metadata ?? {};
  const student = entry.student_name ? `${entry.student_name}` : '';

  switch (entry.action) {
    case 'expense.created':
      return `${strings.actionExpenseCreated}: «${meta['title'] ?? '—'}» (${meta['amount'] ?? '—'})`;
    case 'expense.updated':
      return `${strings.actionExpenseUpdated}: «${meta['title'] ?? '—'}»`;
    case 'expense.deleted':
      return `${strings.actionExpenseDeleted}: «${meta['title'] ?? '—'}» (${meta['amount'] ?? '—'})`;
    case 'student.created':
      return student
        ? `${strings.actionStudentCreated}: ${student}`
        : strings.actionStudentCreated;
    case 'student.updated':
      return student
        ? `${strings.actionStudentUpdated}: ${student}`
        : strings.actionStudentUpdated;
    case 'student.deleted':
      return student
        ? `${strings.actionStudentDeleted}: ${student}`
        : strings.actionStudentDeleted;
    case 'student.topup': {
      const added = meta['added'];
      return student
        ? `${strings.actionStudentTopup}: ${student} (+${added} ${strings.lessonsUnit})`
        : `${strings.actionStudentTopup} (+${added} ${strings.lessonsUnit})`;
    }
    case 'balance.debit': {
      const reason = balanceReasonLabel(String(meta['reason'] ?? entry.summary ?? ''), strings);
      return student
        ? `${strings.actionBalanceDebit}: ${student}${reason ? ` — ${reason}` : ''}`
        : `${strings.actionBalanceDebit}${reason ? `: ${reason}` : ''}`;
    }
    case 'balance.credit': {
      const reason = balanceReasonLabel(String(meta['reason'] ?? entry.summary ?? ''), strings);
      return student
        ? `${strings.actionBalanceCredit}: ${student}${reason ? ` — ${reason}` : ''}`
        : `${strings.actionBalanceCredit}${reason ? `: ${reason}` : ''}`;
    }
    default:
      return entry.summary || entry.action;
  }
}

export function formatActivityLogChanges(
  entry: ActivityLogEntry,
  strings: ActivityLogStrings,
): string[] {
  return (entry.changes ?? [])
    .filter((change) => change.field !== 'balance_lessons' || entry.action.startsWith('student.'))
    .map((change) => {
      const label = fieldLabel(change.field, strings);
      const from = formatValue(change.field, change.from, strings);
      const to = formatValue(change.field, change.to, strings);
      return `${label}: ${from} ${strings.changeArrow} ${to}`;
    });
}
