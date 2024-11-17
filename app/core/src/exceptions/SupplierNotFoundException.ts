import { Exception } from "@hyulian/common";

export class SupplierNotFoundException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("SupplierNotFound", details, reference);
  }
}
