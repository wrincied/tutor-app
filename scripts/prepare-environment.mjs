import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mode = process.argv[2] ?? 'development';
const source =
  mode === 'production'
    ? 'src/environments/environment.production.ts'
    : 'src/environments/environment.development.ts';
const target = 'src/environments/environment.ts';

copyFileSync(resolve(source), resolve(target));
console.log(`Prepared ${target} from ${source}`);
