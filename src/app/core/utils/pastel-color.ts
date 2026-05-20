/** Случайный неяркий пастельный цвет для карточки ученика (HSL). */
export function generatePastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 45%, 88%)`;
}

export const DEFAULT_STUDENT_BORDER_COLOR = 'rgb(14 165 233)';

/** Значение для `<input type="color">` (#rrggbb). */
export function colorToHexForPicker(color: string | null | undefined): string {
  if (!color) {
    return '#bae6fd';
  }
  const trimmed = color.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed;
  }
  if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
    const r = trimmed[1];
    const g = trimmed[2];
    const b = trimmed[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  const hslMatch = trimmed.match(
    /hsl\(\s*([\d.]+)\s*(?:,|\s)\s*([\d.]+)%\s*(?:,|\s)\s*([\d.]+)%\s*\)/i,
  );
  if (hslMatch) {
    return hslToHex(Number(hslMatch[1]), Number(hslMatch[2]), Number(hslMatch[3]));
  }

  const rgbMatch = trimmed.match(/rgb\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i);
  if (rgbMatch) {
    return rgbToHex(Number(rgbMatch[1]), Number(rgbMatch[2]), Number(rgbMatch[3]));
  }

  return '#bae6fd';
}

/** Сохраняем в БД в формате HSL (как при автогенерации). */
export function hexToStoredColor(hex: string): string {
  const rgb = parseHexRgb(hex);
  if (!rgb) {
    return generatePastelColor();
  }
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

function hslToHex(h: number, s: number, l: number): string {
  const sat = s / 100;
  const lit = l / 100;
  const chroma = sat * Math.min(lit, 1 - lit);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = lit - chroma * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * v)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((v) =>
      Math.max(0, Math.min(255, Math.round(v)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}

function parseHexRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = colorToHexForPicker(hex);
  const m = normalized.match(/^#([0-9a-fA-F]{6})$/);
  if (!m) {
    return null;
  }
  const n = Number.parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      default:
        h = ((rn - gn) / d + 4) / 6;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}
