import { Express, NextFunction, Request, Response } from "express";

import {
  ApiContractBody,
  ApiContractParams,
  ApiContractParamsSchema,
  ApiContractQuery,
  ApiContractResponse,
  ApiContractSchema,
  StrictSchemaType,
} from "@hyulian/api-contract";
import { HttpRequestMethods } from "@hyulian/common";

import { RequestContext } from "./requestContextBuilder";

export type ExpressFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
export type AtlasRouter<TSchema extends AtlasContractSchema> = {
  express: Express;
  use: (fn: ExpressFn) => void;
  controller: AtlasRegisterContractFn;
  middleware: AtlasRouterMiddlewareFn<StrictSchemaType<TSchema["params"]>>;
  router: <
    TSubSchema extends AtlasContractSchema<TSubParams>,
    TSubParams extends ApiContractParamsSchema
  >(
    path: string,
    routerFn: AtlasRouterInitFn<TSchema & TSubSchema>,
    subSchema?: TSubSchema
  ) => {
    middleware: AtlasRouterMiddlewareFn<StrictSchemaType<TSubParams>>;
  };
};
export type AtlasRouterInitOptions = {
  disableRouterAndContractPathValidation?: true;
};
export type AtlasRouterInitFn<TSchema extends AtlasContractSchema = any> = (
  router: AtlasRouter<TSchema>
) => void;
export type AtlasMiddlewareWrapperFn<
  TParams extends {} = any,
  TQuery extends {} | undefined = any,
  TBody extends {} | undefined = any
> = (context: RequestContext<TParams, TQuery, TBody>) => Promise<void> | void;
export type AtlasRegisterContractFn = <
  TApiContractSchema extends ApiContractSchema
>(
  contractController: AtlasContractController<TApiContractSchema>
) => {
  middleware: AtlasRouteContractMiddleware<TApiContractSchema>;
};

export type AtlasInstanceContext = {
  express: Express;
  contracts: AtlasApiContractDetail<ApiContractSchema>[];
  middlewares: AtlasMiddlewareDetail[];
};

export type AtlasMiddlewareDetail = {
  path: string;
  method: HttpRequestMethods | "all";
  middleware: AtlasMiddlewareWrapperFn;
};

// export type AtlasRouteContractController<
//   TApiContract extends ApiContract<TResponse, TBody, TParams, TQuery>,
//   TResponse extends ResponseBase<any> = any,
//   TBody extends BodyBase<{}> = any,
//   TParams extends {} = any,
//   TQuery extends {} = any,
// > = (
//   request: RequestContext<TApiContract['params'], ApiContractQuery<TApiContract>, TBody>,
// ) => PromiseLike<TApiContract['response']>;

export type AtlasRouteContractController<
  TApiContractSchema extends ApiContractSchema
> = (
  request: RequestContext<
    ApiContractParams<TApiContractSchema>,
    ApiContractQuery<TApiContractSchema>,
    ApiContractBody<TApiContractSchema>
  >
) => PromiseLike<ApiContractResponse<TApiContractSchema>>;

export type AtlasRouteContractMiddleware<
  TApiContractSchema extends ApiContractSchema
> = (
  fn: AtlasMiddlewareWrapperFn<
    ApiContractParams<TApiContractSchema>,
    ApiContractQuery<TApiContractSchema>,
    ApiContractBody<TApiContractSchema>
  >
) => void;

export type AtlasContractSchema<TParams extends ApiContractParamsSchema = {}> =
  {
    params: TParams;
    // body: ApiContractBodySchema;
    // bodyType: ApiContractBodyType;
    // query: ApiContractQuerySchema;
  };
export type AtlasRouterContractSchema<
  TParams extends ApiContractParamsSchema = any
> = Partial<AtlasContractSchema<TParams>>;

export type AtlasRouterMiddlewareFn<TParams extends {} = {}> = (
  fn: AtlasMiddlewareWrapperFn<TParams>
) => void;

export type AtlasContractController<
  TApiContractSchema extends ApiContractSchema
> = {
  contract: TApiContractSchema;
  controller: AtlasRouteContractController<TApiContractSchema>;
};

export type AtlasApiContractDetail<
  TApiContractSchema extends ApiContractSchema
> = {
  routerBasePath?: string;
  contractPath: string;
  contract: TApiContractSchema;
  controller: AtlasRouteContractController<TApiContractSchema>;
};
