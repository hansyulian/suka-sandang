import { InventoryStatus } from "@app/common";
import { Exception } from "@hyulian/common";

export class InventoryInvalidStatusException extends Exception {
  constructor(expectation: InventoryStatus, reality: any, reference?: string) {
    super(
      "InventoryInvalidStatus",
      {
        expectation,
        reality,
      },
      reference
    );
  }
}
