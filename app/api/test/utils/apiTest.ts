import { atlas, expressErrorHandler } from "@hyulian/express-api-contract";
import Express from "express";
import { controllers } from "~/controllers";
import supertest from "supertest";
import { setupDatabase } from "@app/engine";

const app = atlas(
  (atlas) => {
    atlas.use(Express.json());

    atlas.router("/", controllers);
  },
  {
    onError: expressErrorHandler({
      debug: false,
    }),
  }
);
const instance = supertest(app.express);

export const apiTest = {
  instance,
};
