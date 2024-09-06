import morgan from "morgan";

import { atlas, expressErrorHandler } from "@hyulian/express-api-contract";
import Express from "express";

import { appConfig } from "./config";
import { controllers } from "./controllers";
import { setupDatabase } from "@app/engine";
import cookieParser from "cookie-parser";

const port = appConfig.port;

async function init() {
  await setupDatabase();
  const app = atlas(
    (atlas) => {
      atlas.use(morgan("combined"));
      atlas.use(Express.json());
      atlas.use(cookieParser());
      atlas.router("/", controllers);
    },
    {
      debug: appConfig.debug,
      onError: expressErrorHandler({
        debug: appConfig.debug,
      }),
    }
  );
  app.start(port);
}
init();
