import { Exception } from "@hyulian/common";

export type RequiredSchemaValidationExceptionDetail = {
  type: "required";
  key: string;
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
  value: unknown;
  expected: string;
  actual: string;
};

export type SchemaValidationExceptionDetail =
  | RequiredSchemaValidationExceptionDetail
  | InvalidValueSchemaValidationExceptionDetail
  | InvalidTypeSchemaValidationExceptionDetail;

export type SchemaValidationExceptionDetailTypes =
  SchemaValidationExceptionDetail["type"];

export class SchemaValidationException extends Exception<
  SchemaValidationExceptionDetail[]
> {
  public constructor(
    details: SchemaValidationExceptionDetail[],
    reference?: string
  ) {
    super("schemaValidation", details, reference);
  }
}
