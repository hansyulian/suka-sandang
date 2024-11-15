import { atlas, expressErrorHandler } from "@hyulian/express-api-contract";
import Express from "express";
import { controllers } from "~/controllers";
import supertest, { Response } from "supertest";
import { mockAuthenticated } from "~test/utils/mockAuthenticated";
import { initializationMiddleware } from "~/middlewares/initializationMiddleware";

const app = atlas(
  (atlas) => {
    atlas.use(Express.json());
    // intended to cut connection to the database
    atlas.middleware(initializationMiddleware(null as any));
    atlas.router("/", controllers);
  },
  {
    onError: expressErrorHandler({
      debug: false,
    }),
  }
);
const withoutAuthentication = () => supertest(app.express);

function withAuthentication() {
  mockAuthenticated();
  return {
    get: (path: string) =>
      withoutAuthentication().get(path).set("Authorization", "mock-token"),
    post: (path: string) =>
      withoutAuthentication().post(path).set("Authorization", "mock-token"),
    put: (path: string) =>
      withoutAuthentication().put(path).set("Authorization", "mock-token"),
    delete: (path: string) =>
      withoutAuthentication().delete(path).set("Authorization", "mock-token"),
  };
}

function checkRequireAuthentication(response: Response) {
  expect(response.status).toStrictEqual(401);
  expect(response.body).toEqual({ name: "Unauthorized", details: {} });
}

function testRequireAuthentication() {
  return {
    get: async (path: string) =>
      checkRequireAuthentication(
        await withoutAuthentication().get(path).send()
      ),
    post: async (path: string) =>
      checkRequireAuthentication(
        await withoutAuthentication().post(path).send()
      ),
    put: async (path: string) =>
      checkRequireAuthentication(
        await withoutAuthentication().put(path).send()
      ),
    delete: async (path: string) =>
      checkRequireAuthentication(
        await withoutAuthentication().delete(path).send()
      ),
  };
}

export const apiTest = {
  withoutAuthentication,
  withAuthentication,
  testRequireAuthentication,
};
