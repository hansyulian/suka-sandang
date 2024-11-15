import { NextFunction, Request, Response } from "express";

import {
  ApiContractParams,
  ApiContractSchema,
  ArrayResponse,
  InferMutationContract,
  InferQueryContract,
  MutationContractSchema,
  ObjectResponse,
  PaginatedArrayResponse,
  projectSchema,
  QueryContractSchema,
  SchemaType,
} from "@hyulian/api-contract";

import { AtlasRouteContractController } from "./types";

export type RouteContractOptions = {
  looseResponse?: boolean;
};

export function routeContract<TApiContractSchema extends ApiContractSchema>(
  apiContract: TApiContractSchema,
  controller: AtlasRouteContractController<TApiContractSchema>,
  options: RouteContractOptions = {}
) {
  return async (request: Request, response: Response, next: NextFunction) => {
    type TParams = ApiContractParams<TApiContractSchema>;
    type TQuery = TApiContractSchema extends QueryContractSchema
      ? InferQueryContract<TApiContractSchema>["query"]
      : undefined;
    type TBody = TApiContractSchema extends MutationContractSchema
      ? InferMutationContract<TApiContractSchema>["body"]
      : undefined;
    try {
      // preprocess phase
      const requestContext = (request as any)._atlasContext;
      const functionResponse = await controller(requestContext);
      const responsePreset = response.status(200);
      response.locals = requestContext.locals;
      // processing response
      switch (apiContract.responseType) {
        // right now the typing can't be made strict for the responseType
        case undefined:
        case "object":
          const r = functionResponse as unknown as ObjectResponse<
            SchemaType<TApiContractSchema["model"]>
          >;
          return responsePreset.json(projectSchema(r, apiContract.model));
        case "array":
          const ar = functionResponse as ArrayResponse<
            SchemaType<TApiContractSchema["model"]>
          >;
          const arrayResponse: ArrayResponse<
            SchemaType<TApiContractSchema["model"]>
          > = {
            records: [],
          };
          for (const record of ar.records) {
            const projected = projectSchema(record, apiContract.model);
            arrayResponse.records.push(projected as any);
          }

          return responsePreset.json(arrayResponse);
        case "paginatedArray":
          const par = functionResponse as PaginatedArrayResponse<
            SchemaType<TApiContractSchema["model"]>
          >;
          const paginatedArrayResponse: PaginatedArrayResponse<
            SchemaType<TApiContractSchema["model"]>
          > = {
            records: [],
            info: par.info,
          };
          for (const record of par.records) {
            paginatedArrayResponse.records.push(
              projectSchema(record, apiContract.model) as any
            );
          }
          return responsePreset.json(paginatedArrayResponse);
      }
    } catch (err) {
      next(err);
    }
  };
}
