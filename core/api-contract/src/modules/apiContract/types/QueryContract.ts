import { SchemaType } from '../../schema';
import { ApiContractMethod } from './Base';
import { ApiContractModelSchema } from './Model';
import { ApiContractParamsSchema, ApiContractPathFn } from './Params';
import { ApiContractQuerySchema } from './Query';
import {
  ApiContractResponseType,
  InferResponseType,
  ResponseBase,
} from './Response';

export type QueryContract<
  TResponse extends ResponseBase<any>,
  TParams extends {},
  TQuery extends {},
  TModel = TResponse extends ResponseBase<infer M> ? M : 'unableToInferModel',
> = {
  model: TModel;
  params: TParams;
  query: TQuery;
  response: TResponse;
};

export type QueryContractSchema<
  TPath extends string = string,
  TModel extends ApiContractModelSchema = any,
  TParams extends ApiContractParamsSchema = any,
  TQuery extends ApiContractQuerySchema = any,
  TResponseType extends ApiContractResponseType = any,
> = {
  responseType: TResponseType;
  model: TModel;
  params: TParams;
  query: TQuery;
  method: ApiContractMethod;
  path: TPath;
};

export type InferQueryContract<
  TQueryContractSchema extends QueryContractSchema,
> = QueryContract<
  InferResponseType<
    TQueryContractSchema['responseType'],
    SchemaType<TQueryContractSchema['model']>
  >,
  SchemaType<TQueryContractSchema['params']>,
  SchemaType<TQueryContractSchema['query']>
>;

export type QueryContractModel<
  TQueryContractSchema extends QueryContractSchema,
> = InferQueryContract<TQueryContractSchema>['model'];
export type QueryContractResponse<
  TQueryContractSchema extends QueryContractSchema,
> = InferQueryContract<TQueryContractSchema>['response'];

export type QueryContractParams<
  TQueryContractSchema extends QueryContractSchema,
> = InferQueryContract<TQueryContractSchema>['params'];

export type QueryContractQuery<
  TQueryContractSchema extends QueryContractSchema,
> = InferQueryContract<TQueryContractSchema>['query'];
