import {
  SchemaValidationException,
  SchemaValidationExceptionDetail,
} from "@hyulian/api-contract";
import { Response } from "supertest";

export function validationRejection(
  response: Response,
  validations: SchemaValidationExceptionDetail[]
) {
  const { name, details } = response.body as SchemaValidationException;
  expect(name).toStrictEqual("schemaValidation");
  expect(validations.length).toStrictEqual(details.length);
  for (let i = 0; i < validations.length; i += 1) {
    expect(details[i]).toEqual(validations[i]);
  }
  expect(response).rejects;
}
