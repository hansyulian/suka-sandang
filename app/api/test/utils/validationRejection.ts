import {
  SchemaValidationException,
  SchemaValidationExceptionDetail,
} from "@hyulian/api-contract";
import { contractValidatorCompareFunction } from "@hyulian/express-api-contract";
import { Response } from "supertest";

export function validationRejection(
  response: Response,
  validations: SchemaValidationExceptionDetail[]
) {
  expect(response).rejects;
  const { name, details } = response.body as SchemaValidationException;
  expect(name).toStrictEqual("schemaValidation");
  const sortedValidations = [...validations].sort(
    contractValidatorCompareFunction
  );
  const sortedDetails = [...details].sort(contractValidatorCompareFunction);
  expect(sortedValidations).toEqual(sortedDetails);
}
