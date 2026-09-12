import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { StudentTelegramNotificationSettings } from '@interfaces';
import { StudentService, type Student } from '../../../core/services/student.service';
import { I18nService } from '../../../core/services/i18n.service';
import { UserProfileSettingsService } from '../../../core/services/user-profile-settings.service';
import {
  clampReminderOffset,
  DEFAULT_TELEGRAM_SETTINGS,
  formatReminderOffsetLabel,
  isBuiltinReminderOffset,
  isBlockingTelegramDeliveryError,
  normalizeTelegramSettings,
  REMINDER_OFFSET_MAX,
  REMINDER_OFFSET_MIN,
  type TelegramRoutingTarget,
} from '../../../core/utils/telegram-notification-settings';
import { toTitleCaseName } from '../../../core/utils/to-title-case';
import { AppDialogComponent } from '../../../shared/app-dialog/app-dialog.component';
import { AppSelectComponent, type AppSelectOption } from '../../../shared/app-select';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [FormsModule, AppDialogComponent, AppSelectComponent],
  templateUrl: './notification-settings.component.html',
  styleUrl: './notification-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSettingsComponent implements OnDestroy {
  private readonly svc = inject(StudentService);
  private readonly i18n = inject(I18nService);
  private readonly profileSettings = inject(UserProfileSettingsService);

  /** Student whose Telegram notification settings are being edited. `null` closes the modal. */
  readonly student = input<Student | null>(null);

  readonly studentChange = output<Student>();
  readonly closed = output<void>();
  readonly requestBotToggle = output<Student>();
  readonly requestDisconnect = output<Student>();
  readonly toast = output<string>();

  readonly draft = signal<StudentTelegramNotificationSettings>({ ...DEFAULT_TELEGRAM_SETTINGS });
  readonly saving = signal(false);
  readonly parentInviteLoading = signal(false);
  readonly parentInviteVisible = signal(false);
  /** Local copy so the invite UI does not wait on parent input rebinding. */
  readonly parentInviteLinkLocal = signal('');
  readonly linkCopied = signal(false);
  readonly reminderOffsetMode = signal<'preset' | 'custom'>('preset');
  readonly reminderCustomMinutes = signal(45);
  readonly reminderOffsetMin = REMINDER_OFFSET_MIN;
  readonly reminderOffsetMax = REMINDER_OFFSET_MAX;

  private parentInvitePollTimer: ReturnType<typeof setInterval> | null = null;
  private linkCopiedTimer: ReturnType<typeof setTimeout> | null = null;
  private syncedStudentId: string | null = null;

  readonly t = computed(() => this.i18n.studentsUi());

  readonly open = computed(() => !!this.student());

  readonly subtitle = computed(() => {
    const name = this.student()?.name;
    return name ? toTitleCaseName(name) : null;
  });

  readonly togglesDisabled = computed(() => {
    const s = this.student();
    if (!s?.telegram_user_id && !s?.telegram_chat_id) {
      return true;
    }
    return isBlockingTelegramDeliveryError(s);
  });

  readonly isParentConnected = computed(() => Boolean(this.student()?.telegram_parent_chat_id));

  readonly parentInviteLink = computed(() => {
    return (
      this.parentInviteLinkLocal() ||
      this.student()?.telegram_parent_deep_link ||
      ''
    );
  });

  readonly parentQrSrc = computed(() => {
    const link = this.parentInviteLink();
    if (!link) {
      return '';
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(link)}`;
  });

  readonly parentNotifyEnabled = computed(() =>
    (this.draft().routing_targets ?? []).includes('parent'),
  );

  readonly reminderOffsetOptions = computed((): AppSelectOption[] => {
    const t = this.t();
    const customSaved = this.profileSettings.workspace().customReminderOffsets;
    return [
      { value: '15', label: t.tgReminder15m },
      { value: '30', label: t.tgReminder30m },
      { value: '60', label: t.tgReminder1h },
      { value: '1440', label: t.tgReminder24h },
      ...customSaved.map((minutes) => ({
        value: String(minutes),
        label: formatReminderOffsetLabel(minutes, {
          m15: t.tgReminder15m,
          m30: t.tgReminder30m,
          m60: t.tgReminder1h,
          m1440: t.tgReminder24h,
          custom: (n) => `${t.tgReminderCustom.replace('…', '').trim()} · ${n}`.trim(),
        }),
      })),
      { value: '__custom__', label: t.tgReminderCustom },
    ];
  });

  readonly reminderOffsetValue = computed(() => {
    if (this.reminderOffsetMode() === 'custom') {
      return '__custom__';
    }
    return String(this.draft().lesson_reminder_offset_minutes);
  });

  readonly reminderCanDeleteCustom = computed(() => {
    const minutes = this.draft().lesson_reminder_offset_minutes;
    return (
      this.reminderOffsetMode() !== 'custom' &&
      !isBuiltinReminderOffset(minutes) &&
      this.profileSettings.workspace().customReminderOffsets.includes(minutes)
    );
  });

  constructor() {
    effect(() => {
      const student = this.student();
      if (!student) {
        this.syncedStudentId = null;
        this.stopParentInvitePolling();
        this.parentInviteVisible.set(false);
        return;
      }
      if (this.syncedStudentId === student._id) {
        return;
      }
      this.syncedStudentId = student._id;
      this.hydrateFromStudent(student);
    });
  }

  ngOnDestroy(): void {
    this.stopParentInvitePolling();
    if (this.linkCopiedTimer) {
      clearTimeout(this.linkCopiedTimer);
    }
  }

  private hydrateFromStudent(student: Student): void {
    const settings = normalizeTelegramSettings(student.telegram_notification_settings);
    const targets = settings.routing_targets ?? ['student'];
    this.draft.set(normalizeTelegramSettings({ ...settings, routing_targets: targets }));
    const offset = settings.lesson_reminder_offset_minutes;
    if (
      isBuiltinReminderOffset(offset) ||
      this.profileSettings.workspace().customReminderOffsets.includes(offset)
    ) {
      this.reminderOffsetMode.set('preset');
      this.reminderCustomMinutes.set(45);
    } else {
      this.reminderOffsetMode.set('custom');
      this.reminderCustomMinutes.set(offset);
    }
    this.parentInviteLinkLocal.set('');
    this.parentInviteVisible.set(false);
    this.stopParentInvitePolling();
  }

  formatLinkedAt(value?: string | null): string {
    if (!value) {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleString();
  }

  deliveryError(): string | null {
    const student = this.student();
    if (!student || !isBlockingTelegramDeliveryError(student)) {
      return null;
    }
    const t = this.t();
    switch (student.telegram_delivery_error) {
      case 'BOT_BLOCKED':
        return t.tgErrorBotBlocked;
      case 'CHAT_NOT_FOUND':
        return t.tgErrorChatNotFound;
      case 'USER_DEACTIVATED':
        return t.tgErrorUserDeactivated;
      default:
        return t.tgErrorUnknown;
    }
  }

  patchDraft(patch: Partial<StudentTelegramNotificationSettings>): void {
    this.draft.update((current) => normalizeTelegramSettings({ ...current, ...patch }));
  }

  hasRoutingTarget(target: TelegramRoutingTarget): boolean {
    return (this.draft().routing_targets ?? []).includes(target);
  }

  toggleRoutingTarget(target: TelegramRoutingTarget, enabled: boolean, event?: Event): void {
    event?.stopPropagation();
    if (target === 'parent' || target === 'tutor') {
      return;
    }
    const current = new Set(this.draft().routing_targets ?? []);
    if (enabled) {
      current.add(target);
    } else {
      current.delete(target);
    }
    current.delete('parent');
    current.delete('tutor');
    if (current.size === 0) {
      current.add('student');
    }
    this.patchDraft({ routing_targets: [...current] });
  }

  setReminderOffset(value: string): void {
    if (value === '__custom__') {
      this.reminderOffsetMode.set('custom');
      const current = this.draft().lesson_reminder_offset_minutes;
      this.reminderCustomMinutes.set(isBuiltinReminderOffset(current) ? 45 : current);
      return;
    }
    this.reminderOffsetMode.set('preset');
    this.patchDraft({ lesson_reminder_offset_minutes: clampReminderOffset(value) });
  }

  applyCustomReminderOffset(): void {
    const minutes = clampReminderOffset(this.reminderCustomMinutes());
    this.reminderCustomMinutes.set(minutes);
    this.patchDraft({ lesson_reminder_offset_minutes: minutes });
    if (!isBuiltinReminderOffset(minutes)) {
      this.profileSettings.addCustomReminderOffset(minutes);
    }
    this.reminderOffsetMode.set('preset');
  }

  deleteSelectedCustomReminder(): void {
    const minutes = this.draft().lesson_reminder_offset_minutes;
    if (isBuiltinReminderOffset(minutes)) {
      return;
    }
    this.profileSettings.removeCustomReminderOffset(minutes);
    this.patchDraft({ lesson_reminder_offset_minutes: 60 });
    this.reminderOffsetMode.set('preset');
  }

  onBotToggle(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const student = this.student();
    if (student) {
      this.requestBotToggle.emit(student);
    }
  }

  onClose(): void {
    if (this.saving()) {
      return;
    }
    this.stopParentInvitePolling();
    this.closed.emit();
  }

  onDisconnectStudent(): void {
    const student = this.student();
    if (student) {
      this.requestDisconnect.emit(student);
    }
  }

  onShareParentInvite(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    const student = this.student();
    if (!student || this.parentInviteLoading()) {
      return;
    }
    this.parentInviteVisible.set(true);

    const existing =
      this.parentInviteLinkLocal() || student.telegram_parent_deep_link || '';
    if (existing) {
      this.parentInviteLinkLocal.set(existing);
      if (!student.telegram_parent_chat_id) {
        this.startParentInvitePolling();
      }
      return;
    }

    this.parentInviteLoading.set(true);
    this.svc.ensureParentTelegramInvite(student._id).subscribe({
      next: (updated) => {
        this.parentInviteLoading.set(false);
        const link =
          updated.telegram_parent_deep_link ||
          (updated.telegram_parent_link_token
            ? `https://t.me/simp1e4ubot?start=${encodeURIComponent(updated.telegram_parent_link_token)}`
            : '');
        this.parentInviteLinkLocal.set(link);
        this.applyStudentUpdate(updated);
        if (!updated.telegram_parent_chat_id) {
          this.startParentInvitePolling();
        }
        if (!link) {
          this.toast.emit('Parent invite link was not created');
        }
      },
      error: (err) => {
        this.parentInviteLoading.set(false);
        this.toast.emit(this.apiErrorMessage(err));
      },
    });
  }

  async onCopyParentInvite(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();
    const link = this.parentInviteLink();
    if (!link || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      this.toast.emit('Copy failed');
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      this.linkCopied.set(true);
      if (this.linkCopiedTimer) {
        clearTimeout(this.linkCopiedTimer);
      }
      this.linkCopiedTimer = setTimeout(() => this.linkCopied.set(false), 2000);
    } catch {
      this.toast.emit('Copy failed');
    }
  }

  onDisconnectParent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const student = this.student();
    if (!student || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.svc.disconnectParentTelegram(student._id).subscribe({
      next: (updated) => {
        this.saving.set(false);
        this.applyStudentUpdate(updated);
        this.syncedStudentId = null;
        this.hydrateFromStudent(updated);
        this.parentInviteVisible.set(false);
        this.parentInviteLinkLocal.set(updated.telegram_parent_deep_link || '');
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.emit(this.apiErrorMessage(err));
      },
    });
  }

  onSave(): void {
    const student = this.student();
    if (!student || this.saving()) {
      return;
    }
    if (this.reminderOffsetMode() === 'custom') {
      this.applyCustomReminderOffset();
    }
    this.saving.set(true);
    const settings = normalizeTelegramSettings(this.draft());
    settings.routing_targets = (settings.routing_targets ?? []).filter((t) => t !== 'parent');
    if (!settings.routing_targets.length) {
      settings.routing_targets = ['student'];
    }
    this.svc
      .update(student._id, {
        telegram_notification_settings: settings,
      })
      .subscribe({
        next: (updated) => {
          this.saving.set(false);
          this.applyStudentUpdate(updated);
          this.stopParentInvitePolling();
          this.closed.emit();
        },
        error: (err) => {
          this.saving.set(false);
          this.toast.emit(this.apiErrorMessage(err));
        },
      });
  }

  /** Keep local student in sync when parent polls or invite returns. */
  applyExternalStudent(updated: Student): void {
    if (this.student()?._id !== updated._id) {
      return;
    }
    if (updated.telegram_parent_deep_link) {
      this.parentInviteLinkLocal.set(updated.telegram_parent_deep_link);
    }
    this.applyStudentUpdate(updated);
    if (updated.telegram_parent_chat_id) {
      this.stopParentInvitePolling();
      this.parentInviteVisible.set(false);
      const targets = new Set(this.draft().routing_targets ?? []);
      targets.add('parent');
      this.patchDraft({ routing_targets: [...targets] });
    }
  }

  private applyStudentUpdate(updated: Student): void {
    this.studentChange.emit(updated);
  }

  private startParentInvitePolling(): void {
    this.stopParentInvitePolling();
    const studentId = this.student()?._id;
    if (!studentId) {
      return;
    }
    this.parentInvitePollTimer = setInterval(() => {
      const current = this.student();
      if (!current || current._id !== studentId) {
        this.stopParentInvitePolling();
        return;
      }
      if (current.telegram_parent_chat_id) {
        this.stopParentInvitePolling();
        return;
      }
      this.svc.getOne(studentId).subscribe({
        next: (updated) => this.applyExternalStudent(updated),
        error: () => {
          /* ignore transient poll errors */
        },
      });
    }, 3000);
  }

  private stopParentInvitePolling(): void {
    if (this.parentInvitePollTimer) {
      clearInterval(this.parentInvitePollTimer);
      this.parentInvitePollTimer = null;
    }
  }

  private apiErrorMessage(err: unknown): string {
    const e = err as { error?: { message?: string }; message?: string };
    return e?.error?.message || e?.message || 'Request failed';
  }
}
