import { PurchaseOrderStatus } from "@app/common";
import { Exception } from "@hyulian/common";

export class PurchaseOrderInvalidStatusException extends Exception {
  constructor(
    expectation: PurchaseOrderStatus,
    reality: any,
    reference?: string
  ) {
    super(
      "PurchaseOrderInvalidStatus",
      {
        expectation,
        reality,
      },
      reference
    );
  }
}
