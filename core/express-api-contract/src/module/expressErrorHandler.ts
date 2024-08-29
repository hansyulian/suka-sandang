import { NextFunction, Request, Response } from "express";

import { Exception, GenericException } from "@hyulian/common";

export type CustomErrorType = Error | Exception;
export type OnError = (error: Exception) => Promise<void> | void;
export type ExpressErrorHandlerConfig = {
  debug?: boolean;
  onError?: OnError;
};

function convertGenericErrorToException(err: Error): GenericException {
  const exception = new GenericException(err.message);
  exception.stack = err.stack;
  return exception;
}

export function expressErrorHandler(config: ExpressErrorHandlerConfig) {
  return (
    err: CustomErrorType,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const exception: Exception =
      err instanceof Exception ? err : convertGenericErrorToException(err);
    config.onError?.(exception);
    response.status(500).json({
      name: exception.name,
      reference: exception.reference,
      details: exception.details,
      stack: config.debug ? exception.stack : undefined,
    });
  };
}
