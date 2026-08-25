/** Display names in Title Case without mutating stored values. */
export function toTitleCaseName(value: string | null | undefined): string {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) {
    return '';
  }
  return trimmed
    .split(/(\s+|[-/])/)
    .map((part) => {
      if (!part || /^\s+$/.test(part) || part === '-' || part === '/') {
        return part;
      }
      const first = part.charAt(0);
      if (!/\p{L}/u.test(first)) {
        return part;
      }
      return first.toLocaleUpperCase() + part.slice(1).toLocaleLowerCase();
    })
    .join('');
}
