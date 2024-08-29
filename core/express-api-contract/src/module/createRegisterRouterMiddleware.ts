import { unslash } from "@hyulian/common";

import { AtlasInstanceContext, AtlasMiddlewareWrapperFn } from "./types";

export function createRegisterRouterMiddleware<TParams extends {} = {}>(
  path: string,
  context: AtlasInstanceContext
) {
  return (fn: AtlasMiddlewareWrapperFn<TParams>) => {
    context.middlewares.push({
      method: "all",
      path: unslash(path),
      middleware: fn,
    });
  };
}
