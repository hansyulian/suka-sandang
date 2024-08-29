import { ApiContractBodySchema, ApiContractBodyType, BodyBase } from './Body';
import { ApiContractModelSchema } from './Model';
import {
  InferMutationContract,
  MutationContract,
  MutationContractSchema,
} from './MutationContract';
import { ApiContractParamsSchema } from './Params';
import { ApiContractQuerySchema } from './Query';
import {
  InferQueryContract,
  QueryContract,
  QueryContractSchema,
} from './QueryContract';
import { ApiContractResponseType, ResponseBase } from './Response';

export type ApiContract<
  TResponse extends ResponseBase<any>,
  TBody extends BodyBase<{}>,
  TParams extends {},
  TQuery extends {},
  TModel = TResponse extends ResponseBase<infer M> ? M : 'unableToInferModel',
> =
  | MutationContract<TResponse, TBody, TParams, TModel>
  | QueryContract<TResponse, TQuery, TParams, TModel>;

export type ApiContractSchema<
  TPath extends string = string,
  TModel extends ApiContractModelSchema = any,
  TParams extends ApiContractParamsSchema = any,
  TQuery extends ApiContractQuerySchema = any,
  TBody extends ApiContractBodySchema = any,
  TResponseType extends ApiContractResponseType = any,
  TBodyType extends ApiContractBodyType = any,
> =
  | MutationContractSchema<
      TPath,
      TModel,
      TParams,
      TBody,
      TResponseType,
      TBodyType
    >
  | QueryContractSchema<TPath, TModel, TParams, TQuery, TResponseType>;

export type InferApiContract<TApiContractSchema extends ApiContractSchema> =
  TApiContractSchema extends QueryContractSchema
    ? InferQueryContract<TApiContractSchema>
    : TApiContractSchema extends MutationContractSchema
      ? InferMutationContract<TApiContractSchema>
      : 'unableToInferApiContract';

export type ApiContractModel<TApiContractSchema extends ApiContractSchema> =
  InferApiContract<TApiContractSchema>['model'];
export type ApiContractResponse<TApiContractSchema extends ApiContractSchema> =
  InferApiContract<TApiContractSchema>['response'];

export type ApiContractParams<TApiContractSchema extends ApiContractSchema> =
  InferApiContract<TApiContractSchema>['params'];

export type ApiContractQuery<TApiContractSchema extends ApiContractSchema> =
  TApiContractSchema extends QueryContractSchema
    ? InferQueryContract<TApiContractSchema>['query']
    : undefined;
export type ApiContractBody<TApiContractSchema extends ApiContractSchema> =
  TApiContractSchema extends MutationContractSchema
    ? InferMutationContract<TApiContractSchema>['body']
    : undefined;
