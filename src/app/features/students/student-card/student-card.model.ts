export interface StudentCardData {
  id: string;
  name: string;
  color: string;
  hasTelegram: boolean;
  rate: number;
  rateType: 'lesson' | 'hour';
  currency: string;
  remainingLessons: number;
  lastPaymentDate?: string | null;
  notificationsEnabled: boolean;
}

export interface StudentCardLabels {
  balancePrefix: string;
  lastPaymentPrefix: string;
  topUp: string;
  unitLesson: string;
  unitHour: string;
  perLesson: string;
  perHour: string;
  notificationsOn: string;
  notificationsOff: string;
  telegramConnected: string;
  telegramDisconnected: string;
  openDetails: string;
}
