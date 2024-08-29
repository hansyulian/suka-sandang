import { AtlasRouterInitFn } from './types';

export function createRouter(fn: AtlasRouterInitFn) {
  return fn;
}
