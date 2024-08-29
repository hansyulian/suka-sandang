import { Exception } from "@hyulian/common";

export type SchemaValidationExceptionDetails = {
  details: SchemaValidationExceptionDetail[];
};

export type RequiredSchemaValidationExceptionDetail = {
  type: "required";
  key: string;
  value: string;
};
export type InvalidValueSchemaValidationExceptionDetail = {
  type: "invalidValue";
  key: string;
  value: unknown;
  expected?: any;
};
export type InvalidTypeSchemaValidationExceptionDetail = {
  type: "invalidType";
  key: string;
  value: string;
  expected: string;
  actual: string;
};

export type SchemaValidationExceptionDetail =
  | RequiredSchemaValidationExceptionDetail
  | InvalidValueSchemaValidationExceptionDetail
  | InvalidTypeSchemaValidationExceptionDetail;

export type SchemaValidationExceptionDetailTypes =
  SchemaValidationExceptionDetail["type"];

export class SchemaValidationException extends Exception<SchemaValidationExceptionDetails> {
  public constructor(
    details: SchemaValidationExceptionDetails,
    reference?: string
  ) {
    super("specValidation", details, reference);
  }
}
