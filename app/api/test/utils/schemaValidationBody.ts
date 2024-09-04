import {
  SchemaValidationException,
  SchemaValidationExceptionDetail,
} from "@hyulian/api-contract";

export function schemaValidationBody(
  details: SchemaValidationExceptionDetail[]
) {
  const exception = new SchemaValidationException(details);
  return {
    name: exception.name,
    details: exception.details,
  };
}
