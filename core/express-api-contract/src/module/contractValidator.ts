import { NextFunction, Request, Response } from "express";

import {
  ApiContractSchema,
  MutationContractSchema,
  QueryContractSchema,
  SchemaValidationException,
  validateSchema,
} from "@hyulian/api-contract";

export function contractValidator(apiContract: ApiContractSchema) {
  return function (request: Request, response: Response, next: NextFunction) {
    const errors = [];
    const paramValidation = validateSchema(
      request.params as any,
      apiContract.params,
      "params"
    );
    errors.push(...paramValidation.errors);
    const method = request.method.toLowerCase();
    if (method === "get") {
      const queryContract = apiContract as QueryContractSchema;
      const queryValidation = validateSchema(
        request.query as any,
        (queryContract as QueryContractSchema).query,
        "query"
      );
      errors.push(...queryValidation.errors);
    }
    if (!["get", "delete"].includes(method)) {
      const mutationContract = apiContract as MutationContractSchema;
      if (mutationContract.bodyType === "array") {
        for (const index in request.body) {
          const bodyValidation = validateSchema(
            request.body,
            mutationContract.body,
            `body.${index}`
          );
          errors.push(...bodyValidation.errors);
        }
      } else {
        const bodyValidation = validateSchema(
          request.body,
          mutationContract.body,
          "body"
        );
        errors.push(...bodyValidation.errors);
      }
    }

    if (errors.length > 0) {
      return next(
        new SchemaValidationException({
          details: errors,
        })
      );
    }
    return next();
  };
}
