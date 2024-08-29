import {
  ApiContractBodySchema,
  ApiContractBodyType,
  ApiContractParamsSchema,
  ApiContractQuerySchema,
  ApiContractResponseType,
} from './types';
import { ApiContractModelSchema } from './types/Model';
import { MutationContractSchema } from './types/MutationContract';
import { QueryContractSchema } from './types/QueryContract';

// Overloaded function signatures
export function apiContractSchema<
  TPath extends string,
  TModel extends ApiContractModelSchema,
  TParams extends ApiContractParamsSchema,
  TBody extends ApiContractBodySchema,
  TResponseType extends ApiContractResponseType,
  TBodyType extends ApiContractBodyType,
>(
  contractSchema: MutationContractSchema<
    TPath,
    TModel,
    TParams,
    TBody,
    TResponseType,
    TBodyType
  >,
): MutationContractSchema<
  TPath,
  TModel,
  TParams,
  TBody,
  TResponseType,
  TBodyType
>;

export function apiContractSchema<
  TPath extends string,
  TModel extends ApiContractModelSchema,
  TQuery extends ApiContractQuerySchema,
  TParams extends ApiContractParamsSchema,
  TResponseType extends ApiContractResponseType,
>(
  contractSchema: QueryContractSchema<
    TPath,
    TModel,
    TParams,
    TQuery,
    TResponseType
  >,
): QueryContractSchema<TPath, TModel, TParams, TQuery, TResponseType>;

// Single implementation
export function apiContractSchema<
  TPath extends string,
  TModel extends ApiContractModelSchema,
  TParams extends ApiContractParamsSchema,
  TBody extends ApiContractBodySchema,
  TResponseType extends ApiContractResponseType,
  TBodyType extends ApiContractBodyType,
  TQuery extends ApiContractQuerySchema,
>(
  contractSchema:
    | MutationContractSchema<
        TPath,
        TModel,
        TParams,
        TBody,
        TResponseType,
        TBodyType
      >
    | QueryContractSchema<TPath, TModel, TParams, TQuery, TResponseType>,
):
  | MutationContractSchema<
      TPath,
      TModel,
      TParams,
      TBody,
      TResponseType,
      TBodyType
    >
  | QueryContractSchema<TPath, TModel, TParams, TQuery, TResponseType> {
  return contractSchema;
}
