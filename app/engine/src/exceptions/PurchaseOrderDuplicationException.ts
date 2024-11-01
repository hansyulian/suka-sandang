import { Exception } from "@hyulian/common";

export class PurchaseOrderDuplicationException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("PurchaseOrderDuplication", details, reference);
  }
}
