import { Engine, setupDatabase } from "@app/core";
import { AtlasParameterizedMiddlewareWrapperFn } from "@hyulian/express-api-contract/dist/types/src/module/types";

export const initializationMiddleware: AtlasParameterizedMiddlewareWrapperFn<
  [ReturnType<typeof setupDatabase>]
> = (sequelize) =>
  async function (context) {
    const engine = new Engine({
      sequelizeInstance: sequelize,
    });
    context.locals.engine = engine;
    context.engine = engine;
  };
