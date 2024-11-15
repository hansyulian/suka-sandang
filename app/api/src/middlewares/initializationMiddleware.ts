import { Engine, setupDatabase } from "@app/engine";
import { AtlasParameterizedMiddlewareWrapperFn } from "@hyulian/express-api-contract/dist/types/src/module/types";

export const initializationMiddleware: AtlasParameterizedMiddlewareWrapperFn<
  [ReturnType<typeof setupDatabase>]
> = (sequelize) =>
  async function ({ locals }) {
    locals.engine = new Engine({
      sequelizeInstance: sequelize,
    });
  };
