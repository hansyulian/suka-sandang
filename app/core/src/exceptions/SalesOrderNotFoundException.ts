import { Exception } from "@hyulian/common";

export class SalesOrderNotFoundException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("SalesOrderNotFound", details, reference);
  }
}
