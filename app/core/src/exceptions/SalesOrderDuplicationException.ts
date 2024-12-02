import { Exception } from "@hyulian/common";

export class SalesOrderDuplicationException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("SalesOrderDuplication", details, reference);
  }
}
