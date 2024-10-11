import { NextFunction, Request, Response } from "express";

import {
  ApiContractSchema,
  MutationContractSchema,
  QueryContractSchema,
  SchemaValidationException,
  validateSchema,
} from "@hyulian/api-contract";
import { contractValidatorCompareFunction } from "~/module/contractValidatorCompareFunction";

export function contractValidator(apiContract: ApiContractSchema) {
  return function (request: Request, response: Response, next: NextFunction) {
    const errors = [];
    const paramsValidation = validateSchema(
      request.params as any,
      apiContract.params,
      "params"
    );
    errors.push(...paramsValidation.errors);
    request.params = paramsValidation.value;
    const method = request.method.toLowerCase();
    if (method === "get") {
      const queryContract = apiContract as QueryContractSchema;
      const queryValidation = validateSchema(
        request.query as any,
        (queryContract as QueryContractSchema).query,
        "query"
      );
      errors.push(...queryValidation.errors);
      request.query = queryValidation.value;
    }
    if (!["get", "delete"].includes(method)) {
      const mutationContract = apiContract as MutationContractSchema;
      if (mutationContract.bodyType === "array") {
        const result = [];
        for (const index in request.body) {
          const bodyValidation = validateSchema(
            request.body[index],
            mutationContract.body,
            `body.${index}`
          );
          errors.push(...bodyValidation.errors);
          result.push(bodyValidation.value);
        }
        request.body = result;
      } else {
        const bodyValidation = validateSchema(
          request.body,
          mutationContract.body,
          "body"
        );
        errors.push(...bodyValidation.errors);
        request.body = bodyValidation.value;
      }
    }
    errors.sort(contractValidatorCompareFunction);
    if (errors.length > 0) {
      return next(new SchemaValidationException(errors));
    }
    return next();
  };
}
