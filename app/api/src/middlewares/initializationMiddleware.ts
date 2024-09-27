import { Engine } from "@app/engine";
import { AtlasMiddlewareWrapperFn } from "@hyulian/express-api-contract/dist/types/src/module/types";

export const initializationMiddleware: AtlasMiddlewareWrapperFn =
  async function ({ locals }) {
    locals.engine = new Engine();
  };
