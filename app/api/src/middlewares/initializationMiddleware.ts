import { Engine } from "@app/engine";
import { AtlasParameterizedMiddlewareWrapperFn } from "@hyulian/express-api-contract/dist/types/src/module/types";

export const initializationMiddleware: AtlasParameterizedMiddlewareWrapperFn<
  [Engine]
> = (engine) =>
  async function ({ locals }) {
    locals.engine = engine;
  };
