import { Exception } from "@hyulian/common";

export class InvalidEmailException extends Exception {
  constructor(value?: string, reference?: string) {
    super("InvalidEmail", { value }, reference);
  }
}
