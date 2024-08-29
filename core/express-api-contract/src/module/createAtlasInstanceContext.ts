import express from 'express';

import { AtlasInstanceContext } from './types';

export function createAtlasInstanceContext(): AtlasInstanceContext {
  const appInstance = express();
  return {
    contracts: [],
    middlewares: [],
    express: appInstance,
  };
}
