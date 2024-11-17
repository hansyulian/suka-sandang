import { Exception } from "@hyulian/common";

export class PurchaseOrderNotFoundException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("PurchaseOrderNotFound", details, reference);
  }
}
