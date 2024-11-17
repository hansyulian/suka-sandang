import { Exception } from "@hyulian/common";

export class InvalidCredentialException extends Exception {
  constructor(reference?: string) {
    super("InvalidCredential", {}, reference);
  }
}
