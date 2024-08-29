import { Exception } from "@hyulian/common";

export class InvalidJwtTokenException extends Exception {
  constructor(reference?: string) {
    super("InvalidJwtToken", {}, reference);
  }
}
