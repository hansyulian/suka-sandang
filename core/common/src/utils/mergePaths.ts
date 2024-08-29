import { unslash } from './unslash';

export function mergePaths(...args: string[]) {
  return args
    .map((v) => unslash(v))
    .filter((v) => !!v)
    .join('/');
}
