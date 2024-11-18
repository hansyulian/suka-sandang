import { SalesOrderStatus } from "@app/common";
import { Exception } from "@hyulian/common";

export class SalesOrderInvalidStatusException extends Exception {
  constructor(expectation: SalesOrderStatus, reality: any, reference?: string) {
    super(
      "SalesOrderInvalidStatus",
      {
        expectation,
        reality,
      },
      reference
    );
  }
}
