import { Exception } from "@hyulian/common";
import { Response } from "supertest";

export function expectRejection(response: Response, exception: Exception) {
  const { body } = response;
  expect(response.status).not.toBe(200);
  expect(body.name).toStrictEqual(exception.name);
  expect(body.details).toEqual(exception.details);
}
