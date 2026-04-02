import { Injectable, computed, signal } from '@angular/core';
import type { Lang, NavStrings, StudentStrings, RateCurrency } from '@interfaces';

export type { Lang, RateCurrency } from '@interfaces';

const STORAGE_KEY = 'tutor_lang';

const NAV: Record<Lang, NavStrings> = {
  ru: {
    home: 'Главная',
    students: 'Ученики',
    calendar: 'Расписание',
    finance: 'Финансы',
    themeDark: 'Тёмная',
    themeLight: 'Светлая',
    logout: 'Выйти',
    language: 'Язык',
  },
  en: {
    home: 'Home',
    students: 'Students',
    calendar: 'Schedule',
    finance: 'Finance',
    themeDark: 'Dark',
    themeLight: 'Light',
    logout: 'Log out',
    language: 'Language',
  },
  de: {
    home: 'Start',
    students: 'Schüler',
    calendar: 'Kalender',
    finance: 'Finanzen',
    themeDark: 'Dunkel',
    themeLight: 'Hell',
    logout: 'Abmelden',
    language: 'Sprache',
  },
  kz: {
    home: 'Басты',
    students: 'Оқушылар',
    calendar: 'Кесте',
    finance: 'Қаржы',
    themeDark: 'Қараңғы',
    themeLight: 'Жарық',
    logout: 'Шығу',
    language: 'Тіл',
  },
};
const STUDENTS: Record<Lang, StudentStrings> = {
  ru: {
    addButton: '+ Добавить',
    emptyState: 'Нет учеников. Добавьте первого.',
    loading: 'Загрузка...',
    newStudent: 'Новый ученик',
    editModalTitle: 'Редактировать',
    name: 'Имя',
    ratePerHour: 'Ставка в час',
    rateColumn: 'Ставка',
    balanceLessons: 'Баланс уроков',
    perHour: '/ час',
    timezone: 'Часовой пояс',
    edit: 'Изменить',
    delete: 'Удалить',
    topup: 'Пополнить',
    cancel: 'Отмена',
    save: 'Сохранить',
    close: 'Закрыть',
    autoTimezone: 'Брать часовой пояс с этого устройства',
    deleteConfirm: 'Удалить этого ученика? Это действие нельзя отменить.',
    topupTitle: 'Пополнить баланс',
    topupHint: 'Сколько уроков добавить?',
    topupApply: 'Добавить',
    currency: 'Валюта',
  },
  en: {
    addButton: '+ Add',
    emptyState: 'No students yet. Add the first one.',
    loading: 'Loading...',
    newStudent: 'New student',
    editModalTitle: 'Edit student',
    name: 'Name',
    ratePerHour: 'Rate per hour',
    rateColumn: 'Rate',
    balanceLessons: 'Lesson balance',
    perHour: '/ hr',
    timezone: 'Time zone',
    edit: 'Edit',
    delete: 'Delete',
    topup: 'Top up',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    autoTimezone: 'Use this device’s time zone',
    deleteConfirm: 'Delete this student? This cannot be undone.',
    topupTitle: 'Top up balance',
    topupHint: 'How many lessons to add?',
    topupApply: 'Add',
    currency: 'Currency',
  },
  de: {
    addButton: '+ Hinzufügen',
    emptyState: 'Noch keine Schüler. Legen Sie den ersten an.',
    loading: 'Laden...',
    newStudent: 'Neuer Schüler',
    editModalTitle: 'Bearbeiten',
    name: 'Name',
    ratePerHour: 'Stundensatz',
    rateColumn: 'Satz',
    balanceLessons: 'Stunden-Guthaben',
    perHour: '/ Std.',
    timezone: 'Zeitzone',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    topup: 'Aufladen',
    cancel: 'Abbrechen',
    save: 'Speichern',
    close: 'Schließen',
    autoTimezone: 'Zeitzone dieses Geräts verwenden',
    deleteConfirm: 'Diesen Schüler löschen? Das kann nicht rückgängig gemacht werden.',
    topupTitle: 'Guthaben aufladen',
    topupHint: 'Wie viele Stunden hinzufügen?',
    topupApply: 'Hinzufügen',
    currency: 'Währung',
  },
  kz: {
    addButton: '+ Қосу',
    emptyState: 'Оқушылар жоқ. Біріншісін қосыңыз.',
    loading: 'Жүктелуде...',
    newStudent: 'Жаңа оқушы',
    editModalTitle: 'Өңдеу',
    name: 'Аты',
    ratePerHour: 'Сағаттық баға',
    rateColumn: 'Баға',
    balanceLessons: 'Сабақ балансы',
    perHour: '/ сағ',
    timezone: 'Уақыт аймағы',
    edit: 'Өзгерту',
    delete: 'Өшіру',
    topup: 'Толықтыру',
    cancel: 'Болдырмау',
    save: 'Сақтау',
    close: 'Жабу',
    autoTimezone: 'Құрылғының уақыт аймағын қолдану',
    deleteConfirm: 'Бұл оқушыны жою керек пе? Болдырмау мүмкін емес.',
    topupTitle: 'Балансты толықтыру',
    topupHint: 'Қанша сабақ қосу керек?',
    topupApply: 'Қосу',
    currency: 'Валюта',
  },
};

const CURRENCY_LABELS: Record<Lang, Record<RateCurrency, string>> = {
  ru: {
    BYN: 'Белорусские рубли',
    PLN: 'Злотые',
    EUR: 'Евро',
    USD: 'Доллары',
    RUB: 'Российские рубли',
  },
  en: {
    BYN: 'Belarusian rubles',
    PLN: 'Polish zloty',
    EUR: 'Euro',
    USD: 'US dollars',
    RUB: 'Russian rubles',
  },
  de: {
    BYN: 'Weißrussische Rubel',
    PLN: 'Złoty',
    EUR: 'Euro',
    USD: 'US-Dollar',
    RUB: 'Russische Rubel',
  },
  kz: {
    BYN: 'Беларусь рублдері',
    PLN: 'Злотый',
    EUR: 'Евро',
    USD: 'Доллар',
    RUB: 'Ресей рублі',
  },
};

/** Названия языков на самом языке (в списке выбора). */
const LANG_LABEL: Record<Lang, string> = {
  ru: 'Русский',
  en: 'English',
  de: 'Deutsch',
  kz: 'Қазақша',
};

const ALL_LANGS: Lang[] = ['ru', 'en', 'de', 'kz'];

function readStoredLang(): Lang {
  if (typeof localStorage === 'undefined') {
    return 'ru';
  }
  const v = localStorage.getItem(STORAGE_KEY);
  if (v && (ALL_LANGS as string[]).includes(v)) {
    return v as Lang;
  }
  return 'ru';
}

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly _lang = signal<Lang>(readStoredLang());

  /** Текущий код языка. */
  readonly lang = this._lang.asReadonly();

  /** Строки для навбара (и нижней панели) на текущем языке. */
  readonly nav = computed(() => NAV[this._lang()]);

  /** Строки экрана «Ученики». */
  readonly studentsUi = computed(() => STUDENTS[this._lang()]);

  readonly allLangs = ALL_LANGS;

  setLang(lang: Lang): void {
    this._lang.set(lang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  labelForLang(code: Lang): string {
    return LANG_LABEL[code];
  }

  /** Название валюты для ставки (локализовано). */
  currencyLabel(code: RateCurrency): string {
    return CURRENCY_LABELS[this._lang()][code];
  }
}
