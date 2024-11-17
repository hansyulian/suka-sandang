import {
  ApiContractBody,
  ApiContractParams,
  ApiContractQuery,
  ApiContractSchema,
} from "@hyulian/api-contract";
import { unslash } from "@hyulian/common";

import { getContractExpressPath } from "./getContractExpressPath";
import {
  AtlasInstanceContext,
  AtlasMiddlewareWrapperFn,
  AtlasRouteContractMiddleware,
} from "./types";

type CreateAtlasRouteContractMiddleware = <
  TApiContractSchema extends ApiContractSchema
>(
  apiContract: TApiContractSchema,
  context: AtlasInstanceContext
) => AtlasRouteContractMiddleware<TApiContractSchema>;

export const createRegisterContractMiddleware: CreateAtlasRouteContractMiddleware =
  <TApiContractSchema extends ApiContractSchema>(
    contract: TApiContractSchema,
    context: AtlasInstanceContext
  ) => {
    return (
      fn: AtlasMiddlewareWrapperFn<
        ApiContractParams<TApiContractSchema>,
        ApiContractQuery<TApiContractSchema>,
        ApiContractBody<TApiContractSchema>
      >
    ) => {
      const path = getContractExpressPath(contract);
      context.middlewares.push({
        method: contract.method,
        path: unslash(path),
        middleware: fn,
      });
    };
  };
