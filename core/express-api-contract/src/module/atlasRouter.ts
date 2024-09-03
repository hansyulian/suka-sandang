import {
  ApiContractParamsSchema,
  StrictSchemaType,
} from "@hyulian/api-contract";
import { mergePaths, unslash } from "@hyulian/common";

import { createRegisterController } from "./createRegisterController";
import { createRegisterRouterMiddleware } from "./createRegisterRouterMiddleware";
import {
  AtlasContractSchema,
  AtlasInstanceContext,
  AtlasRouter,
  AtlasRouterInitFn as AtlasRouterFn,
  ExpressFn,
} from "./types";

export function atlasRouter<
  TParams extends ApiContractParamsSchema,
  TSchema extends AtlasContractSchema<TParams> = AtlasContractSchema<TParams>
>(
  path: string,
  context: AtlasInstanceContext,
  schema: TSchema
): AtlasRouter<TSchema> {
  const normalizedPath = `/${unslash(path)}`;
  return {
    express: context.express,
    use: (fn: ExpressFn) => {
      context.express.use(normalizedPath, fn);
    },
    controller: createRegisterController(normalizedPath, context),
    router: <
      TSubSchema extends AtlasContractSchema<TSubParams>,
      TSubParams extends ApiContractParamsSchema
    >(
      subPath: string,
      routerFn: AtlasRouterFn<TSchema & TSubSchema>,
      subSchema?: TSubSchema
    ) => {
      const newPath = mergePaths(normalizedPath, subPath);
      const params = {
        ...schema.params,
        ...subSchema?.params,
      };
      const subAtlasRouter = atlasRouter<TParams & TSubParams>(
        newPath,
        context,
        {
          params: params as TParams & TSubParams,
        }
      );
      routerFn(subAtlasRouter);
      return {
        middleware: createRegisterRouterMiddleware<
          StrictSchemaType<TSubParams>
        >(normalizedPath, context),
      };
    },
    middleware: createRegisterRouterMiddleware<StrictSchemaType<TParams>>(
      normalizedPath,
      context
    ),
  };
}
