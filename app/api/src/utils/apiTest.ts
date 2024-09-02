import { atlas } from "@hyulian/express-api-contract";
import Express from "express";
import { controllers } from "~/controllers";
import supertest from "supertest";

export function apiTest() {
  const app = atlas((atlas) => {
    atlas.use(Express.json());
    atlas.router("/", controllers);
  });
  return {
    instance: supertest(app.express),
  };
}
