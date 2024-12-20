import morgan from "morgan";

import { atlas, expressErrorHandler } from "@hyulian/express-api-contract";
import Express from "express";

import { appConfig } from "./config";
import { controllers } from "./controllers";
import cookieParser from "cookie-parser";
import { initializationMiddleware } from "~/middlewares/initializationMiddleware";
import { setupDatabase } from "@app/core";

const sequelize = setupDatabase();

export const app = atlas(
  (atlas) => {
    atlas.use(morgan("combined"));
    atlas.use(Express.json());
    atlas.use(cookieParser());
    atlas.middleware(initializationMiddleware(sequelize));
    atlas.router("/", controllers);
  },
  {
    debug: appConfig.debug,
    onError: expressErrorHandler({
      debug: appConfig.debug,
    }),
  }
);
