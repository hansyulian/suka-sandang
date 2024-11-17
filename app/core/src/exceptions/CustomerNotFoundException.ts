import { Exception } from "@hyulian/common";

export class CustomerNotFoundException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("CustomerNotFound", details, reference);
  }
}
