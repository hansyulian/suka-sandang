import express from "express";

import { AtlasInstanceContext } from "./types";
import { requestContextBuilder } from "~/module/requestContextBuilder";

export function createAtlasInstanceContext(): AtlasInstanceContext {
  const appInstance = express();
  appInstance.use((request, response, next) => {
    (request as any)._atlasContext = requestContextBuilder(request, response);
    next();
  });
  return {
    contracts: [],
    middlewares: [],
    express: appInstance,
  };
}
