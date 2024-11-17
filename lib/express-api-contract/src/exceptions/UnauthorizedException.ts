import { Exception } from "@hyulian/common";

export class UnauthorizedException extends Exception {
  constructor(reference?: string) {
    super("Unauthorized", {}, reference);
  }
}
