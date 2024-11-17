import { Exception } from "@hyulian/common";

export class InventoryFlowInvalidQuantityException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("InventoryFlowInvalidQuantity", details, reference);
  }
}
