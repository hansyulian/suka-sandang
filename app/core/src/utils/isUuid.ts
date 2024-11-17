import { validate } from "uuid";

export function isUuid(value: string) {
  return validate(value);
}
