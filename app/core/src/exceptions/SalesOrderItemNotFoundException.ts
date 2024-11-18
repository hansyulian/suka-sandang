import { Exception } from "@hyulian/common";

export class SalesOrderItemNotFoundException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("SalesOrderItemNotFound", details, reference);
  }
}
