import { Exception } from "@hyulian/common";

export class PurchaseOrderItemNotFoundException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("PurchaseOrderItemNotFound", details, reference);
  }
}
