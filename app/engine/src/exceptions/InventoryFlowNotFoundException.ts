import { Exception } from "@hyulian/common";

export class InventoryFlowNotFoundException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("InventoryFlowNotFound", details, reference);
  }
}
