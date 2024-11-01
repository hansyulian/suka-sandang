import { SchemaValidationExceptionDetail } from "@hyulian/api-contract";

export function contractValidatorCompareFunction(
  a: SchemaValidationExceptionDetail,
  b: SchemaValidationExceptionDetail
) {
  if (a.key > b.key) {
    return 1;
  }
  if (a.key < b.key) {
    return -1;
  }
  if (a.type > b.type) {
    return 1;
  }
  if (a.type < b.type) {
    return -1;
  }
  return 0;
}
