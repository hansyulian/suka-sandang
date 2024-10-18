// not sure why but import {Exception} from '@hyulian/common' causes the following issue
//   TypeError: Class extends value undefined is not a constructor or null

//   27 |   SchemaValidationExceptionDetail["type"];
//   28 |
// > 29 | export class SchemaValidationException extends Exception<
//      |                                                ^
//   30 |   SchemaValidationExceptionDetail[]
//   31 | > {
//   32 |   public constructor(

export abstract class Exception<Details extends object = {}> extends Error {
  public reference?: string;
  public name: string;
  public details: Details;
  public static _isException: boolean = true;

  public constructor(name: string, details: Details, reference?: string) {
    super(
      JSON.stringify({
        name,
        details,
        reference,
      })
    );
    this.reference = reference;
    this.name = name;
    this.details = details;
  }
}

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
