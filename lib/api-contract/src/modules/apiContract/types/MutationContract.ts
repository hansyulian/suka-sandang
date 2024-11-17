import { SchemaType } from "../../schema";
import { ApiContractMethod } from "./Base";
import {
  ApiContractBodySchema,
  ApiContractBodyType,
  BodyBase,
  InferBodyType,
} from "./Body";
import { ApiContractModelSchema } from "./Model";
import { ApiContractParamsSchema } from "./Params";
import {
  ApiContractResponseType,
  InferResponseType,
  ResponseBase,
} from "./Response";

export type MutationContract<
  TResponse extends ResponseBase<any>,
  TParams extends {},
  TBody extends BodyBase<{}>,
  TModel = TResponse extends ResponseBase<infer M> ? M : "unableToInferModel"
> = {
  model: TModel;
  params: TParams;
  body: TBody;
  response: TResponse;
};

export type MutationContractSchema<
  TPath extends string = string,
  TModel extends ApiContractModelSchema = any,
  TParams extends ApiContractParamsSchema = any,
  TBody extends ApiContractBodySchema = any,
  TResponseType extends ApiContractResponseType = any,
  TBodyType extends ApiContractBodyType = any
> = {
  responseType: TResponseType;
  bodyType: TBodyType;
  model: TModel;
  params: TParams;
  body: TBody;
  method: ApiContractMethod;
  path: TPath;
};

export type InferMutationContract<
  TMutationContractSchema extends MutationContractSchema
> = MutationContract<
  InferResponseType<
    TMutationContractSchema["responseType"],
    SchemaType<TMutationContractSchema["model"]>
  >,
  SchemaType<TMutationContractSchema["params"]>,
  InferBodyType<
    TMutationContractSchema["bodyType"],
    SchemaType<TMutationContractSchema["body"]>
  >
>;

export type MutationContractModel<
  TMutationContractSchema extends MutationContractSchema
> = InferMutationContract<TMutationContractSchema>["model"];
export type MutationContractResponse<
  TMutationContractSchema extends MutationContractSchema
> = InferMutationContract<TMutationContractSchema>["response"];

export type MutationContractParams<
  TMutationContractSchema extends MutationContractSchema
> = InferMutationContract<TMutationContractSchema>["params"];

export type MutationContractBody<
  TMutationContractSchema extends MutationContractSchema
> = InferMutationContract<TMutationContractSchema>["body"];
