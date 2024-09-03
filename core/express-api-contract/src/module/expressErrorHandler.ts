import { NextFunction, Request, Response } from "express";

import { Exception, GenericException } from "@hyulian/common";
import { UnauthorizedException } from "~/exceptions";

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
    const exceptionJson = {
      name: exception.name,
      reference: exception.reference,
      details: exception.details,
      stack: config.debug ? exception.stack : undefined,
    };
    if (err instanceof UnauthorizedException) {
      response.status(401).json(exceptionJson);
    } else {
      response.status(500).json(exceptionJson);
    }
    if (config.debug) {
      const processedStack = exception.stack?.split("\n") ?? [];
      console.error(
        JSON.stringify({ ...exceptionJson, stack: processedStack }, null, 4)
      );
    }
  };
}
