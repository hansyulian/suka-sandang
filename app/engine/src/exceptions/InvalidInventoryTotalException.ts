import { Exception } from "@hyulian/common";

export class InvalidInventoryTotalException extends Exception {
  constructor(details: any, reference?: string) {
    super("InvalidInventoryTotal", details, reference);
  }
}
