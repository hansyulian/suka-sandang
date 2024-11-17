import {
  ApiContractBodySchema,
  ApiContractBodyType,
  ApiContractParamsSchema,
  ApiContractPathFn,
  ApiContractResponseType,
} from './types';
import { ApiContractModelSchema } from './types/Model';
import { MutationContractSchema } from './types/MutationContract';

export function mutationContractSchema<
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
) {
  return contractSchema;
}
