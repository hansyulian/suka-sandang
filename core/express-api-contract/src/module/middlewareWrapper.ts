import { NextFunction, Request, Response } from 'express';

import { RequestContext, requestContextBuilder } from './requestContextBuilder';
import { AtlasMiddlewareWrapperFn } from './types';

export function middlewareWrapper(fn: AtlasMiddlewareWrapperFn) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const requestContext = requestContextBuilder(request, response);
      await fn(requestContext);
      response.locals = requestContext.locals;
      return next();
    } catch (err) {
      next(err);
    }
  };
}
