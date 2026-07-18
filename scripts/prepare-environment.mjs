import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mode = process.argv[2] ?? 'development';
const sourceByMode = {
  production: 'src/environments/environment.production.ts',
  design: 'src/environments/environment.design.ts',
  development: 'src/environments/environment.development.ts',
};
const source = sourceByMode[mode] ?? sourceByMode.development;
const target = 'src/environments/environment.ts';

copyFileSync(resolve(source), resolve(target));
console.log(`Prepared ${target} from ${source}`);
