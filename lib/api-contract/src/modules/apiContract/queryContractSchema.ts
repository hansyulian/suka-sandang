import {
  ApiContractParamsSchema,
  ApiContractPathFn,
  ApiContractQuerySchema,
  ApiContractResponseType,
} from "./types";
import { ApiContractModelSchema } from "./types/Model";
import { QueryContractSchema } from "./types/QueryContract";

export function queryContractSchema<
  TPath extends string,
  TModel extends ApiContractModelSchema,
  TQuery extends ApiContractQuerySchema,
  TParams extends ApiContractParamsSchema,
  TResponseType extends ApiContractResponseType
>(
  contractSchema: QueryContractSchema<
    TPath,
    TModel,
    TParams,
    TQuery,
    TResponseType
  >
) {
  return contractSchema;
}
