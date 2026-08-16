import type { HelpFormStrings, Lang } from '@interfaces';

const HELP_FORM_DE: HelpFormStrings = {
  formTitle: 'Nachricht an den Support',
  nameLabel: 'Name',
  emailLabel: 'E-Mail',
  subjectLabel: 'Betreff',
  messageLabel: 'Nachricht',
  submit: 'Senden',
  sending: 'Wird gesendet…',
  success: 'Danke! Wir melden uns bald unter Ihrer E-Mail.',
  error: 'Nachricht konnte nicht gesendet werden. Bitte später erneut versuchen.',
  captchaRequired: 'Bitte die Sicherheitsprüfung abschließen.',
  rateLimited: 'Zu viele Anfragen. Bitte in ein paar Minuten erneut versuchen.',
  mailHint: 'Oder schreiben Sie an {email}',
  mailCta: 'E-Mail öffnen',
};

const HELP_FORM_EN: HelpFormStrings = {
  formTitle: 'Message support',
  nameLabel: 'Name',
  emailLabel: 'Email',
  subjectLabel: 'Subject',
  messageLabel: 'Message',
  submit: 'Send',
  sending: 'Sending…',
  success: 'Thanks! We’ll reply to your email soon.',
  error: 'Could not send the message. Please try again later.',
  captchaRequired: 'Please complete the security check.',
  rateLimited: 'Too many requests. Please try again in a few minutes.',
  mailHint: 'Or email {email}',
  mailCta: 'Open email',
};

const HELP_FORM_RU: HelpFormStrings = {
  formTitle: 'Написать в поддержку',
  nameLabel: 'Имя',
  emailLabel: 'Email',
  subjectLabel: 'Тема',
  messageLabel: 'Сообщение',
  submit: 'Отправить',
  sending: 'Отправка…',
  success: 'Спасибо! Ответим на ваш email в ближайшее время.',
  error: 'Не удалось отправить сообщение. Попробуйте позже.',
  captchaRequired: 'Пройдите проверку безопасности.',
  rateLimited: 'Слишком много запросов. Попробуйте через несколько минут.',
  mailHint: 'Или напишите на {email}',
  mailCta: 'Открыть почту',
};

const HELP_FORM_UK: HelpFormStrings = {
  formTitle: 'Написати в підтримку',
  nameLabel: 'Ім’я',
  emailLabel: 'Email',
  subjectLabel: 'Тема',
  messageLabel: 'Повідомлення',
  submit: 'Надіслати',
  sending: 'Надсилання…',
  success: 'Дякуємо! Відповімо на ваш email найближчим часом.',
  error: 'Не вдалося надіслати повідомлення. Спробуйте пізніше.',
  captchaRequired: 'Пройдіть перевірку безпеки.',
  rateLimited: 'Занадто багато запитів. Спробуйте за кілька хвилин.',
  mailHint: 'Або напишіть на {email}',
  mailCta: 'Відкрити пошту',
};

const HELP_FORM_BY: HelpFormStrings = {
  formTitle: 'Напісаць у падтрымку',
  nameLabel: 'Імя',
  emailLabel: 'Email',
  subjectLabel: 'Тэма',
  messageLabel: 'Паведамленне',
  submit: 'Адправіць',
  sending: 'Адпраўка…',
  success: 'Дзякуй! Адкажам на ваш email у бліжэйшы час.',
  error: 'Не ўдалося адправіць паведамленне. Паспрабуйце пазней.',
  captchaRequired: 'Прайдзіце праверку бяспекі.',
  rateLimited: 'Занадта шмат запытаў. Паспрабуйце праз некалькі хвілін.',
  mailHint: 'Або напішыце на {email}',
  mailCta: 'Адкрыць пошту',
};

const HELP_FORM_KZ: HelpFormStrings = {
  formTitle: 'Қолдауға жазу',
  nameLabel: 'Аты',
  emailLabel: 'Email',
  subjectLabel: 'Тақырып',
  messageLabel: 'Хабарлама',
  submit: 'Жіберу',
  sending: 'Жіберілуде…',
  success: 'Рахмет! Жақында email-ге жауап береміз.',
  error: 'Хабарлама жіберілмеді. Кейінірек көріңіз.',
  captchaRequired: 'Қауіпсіздік тексерісін өтіңіз.',
  rateLimited: 'Тым көп сұрау. Бірнеше минуттан кейін қайталап көріңіз.',
  mailHint: 'Немесе {email} мекенжайына жазыңыз',
  mailCta: 'Поштаны ашу',
};

export const HELP_FORM_LOCALES: Record<Lang, HelpFormStrings> = {
  de: HELP_FORM_DE,
  en: HELP_FORM_EN,
  ru: HELP_FORM_RU,
  uk: HELP_FORM_UK,
  by: HELP_FORM_BY,
  kz: HELP_FORM_KZ,
};

export { HELP_FORM_DE, HELP_FORM_EN, HELP_FORM_RU, HELP_FORM_UK, HELP_FORM_BY, HELP_FORM_KZ };
