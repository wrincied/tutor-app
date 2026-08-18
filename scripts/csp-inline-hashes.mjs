import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
const re = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let i = 0;
while ((match = re.exec(html))) {
  i += 1;
  const body = match[1];
  const hash = createHash('sha256').update(body, 'utf8').digest('base64');
  console.log(`script ${i} sha256-${hash}`);
}
