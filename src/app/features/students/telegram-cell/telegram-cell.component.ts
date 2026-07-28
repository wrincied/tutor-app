import { Component, input, output } from '@angular/core';
import type { Student } from '@interfaces';

export type TelegramCellState = 'connected' | 'paused' | 'error' | 'disconnected';

export function telegramCellState(student: Student): TelegramCellState {
  if (!student.telegram_user_id && !student.telegram_chat_id) {
    return 'disconnected';
  }
  if (student.telegram_delivery_status === 'error') {
    return 'error';
  }
  if (!student.bot_active) {
    return 'paused';
  }
  return 'connected';
}

export function telegramDisplayHandle(student: Student): string {
  const username = String(student.telegram_username || '').replace(/^@/, '').trim();
  if (username) {
    return `@${username}`;
  }
  const id = String(student.telegram_user_id || student.telegram_chat_id || '');
  if (id.length >= 4) {
    return `•••${id.slice(-4)}`;
  }
  return student.telegram_display_name || 'Telegram';
}

export function telegramChatUrl(student: Student): string | null {
  const username = String(student.telegram_username || '').replace(/^@/, '').trim();
  if (username) {
    return `https://t.me/${username}`;
  }
  return null;
}

@Component({
  selector: 'app-telegram-cell',
  standalone: true,
  templateUrl: './telegram-cell.component.html',
  styleUrl: './telegram-cell.component.scss',
})
export class TelegramCellComponent {
  readonly student = input.required<Student>();
  readonly labels = input.required<{
    connected: string;
    notConnected: string;
    error: string;
    paused: string;
    bind: string;
    openChat: string;
    connectedTooltip: string;
    notConnectedTooltip: string;
    errorTooltip: string;
  }>();
  readonly compact = input(false);

  readonly bindClick = output<Student>();
  readonly configureClick = output<Student>();

  state(): TelegramCellState {
    return telegramCellState(this.student());
  }

  handle(): string {
    return telegramDisplayHandle(this.student());
  }

  chatUrl(): string | null {
    return telegramChatUrl(this.student());
  }

  tooltip(): string {
    const labels = this.labels();
    const state = this.state();
    if (state === 'connected') {
      return labels.connectedTooltip;
    }
    if (state === 'disconnected') {
      return labels.notConnectedTooltip;
    }
    if (state === 'error') {
      return labels.errorTooltip;
    }
    return labels.paused;
  }

  onPrimaryClick(event: Event): void {
    event.stopPropagation();
    const s = this.student();
    if (this.state() === 'disconnected') {
      this.bindClick.emit(s);
      return;
    }
    this.configureClick.emit(s);
  }

  onBindClick(event: Event): void {
    event.stopPropagation();
    this.bindClick.emit(this.student());
  }

  onOpenChat(event: Event): void {
    event.stopPropagation();
  }
}
