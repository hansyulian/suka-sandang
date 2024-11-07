import { InventoryFlowActivity } from "@app/common";
import { Exception } from "@hyulian/common";

export class InventoryFlowInvalidActivityException extends Exception {
  constructor(
    reality: InventoryFlowActivity,
    expectation: InventoryFlowActivity[],
    reference?: string
  ) {
    super("InventoryFlowInvalidActivity", { reality, expectation }, reference);
  }
}
