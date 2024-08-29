import { Exception } from "@hyulian/common";

export class ExpiredJwtTokenException extends Exception {
  constructor(reference?: string) {
    super("ExpiredJwtToken", {}, reference);
  }
}
