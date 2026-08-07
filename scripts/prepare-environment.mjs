import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const mode = process.argv[2] ?? 'development-local';
const sourceByMode = {
  production: 'src/environments/environment.production.ts',
  'production-design': 'src/environments/environment.production.ts',
  'development-local': 'src/environments/environment.development-local.ts',
  'development-remote': 'src/environments/environment.development-remote.ts',
  // aliases
  development: 'src/environments/environment.development-local.ts',
  local: 'src/environments/environment.development-local.ts',
  remote: 'src/environments/environment.development-remote.ts',
};
const source = sourceByMode[mode] ?? sourceByMode['development-local'];
const target = 'src/environments/environment.ts';

copyFileSync(resolve(source), resolve(target));
console.log(`Prepared ${target} from ${source}`);
