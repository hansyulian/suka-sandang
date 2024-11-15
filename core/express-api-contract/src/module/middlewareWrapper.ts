import { NextFunction, Request, Response } from "express";

import { AtlasMiddlewareWrapperFn } from "./types";

export function middlewareWrapper(fn: AtlasMiddlewareWrapperFn) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const requestContext = (request as any)._atlasContext;
      response.locals = requestContext.locals;
      await fn(requestContext);
      return next();
    } catch (err) {
      next(err);
    }
  };
}
