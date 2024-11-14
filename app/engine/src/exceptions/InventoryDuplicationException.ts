import { Exception } from "@hyulian/common";

export class InventoryDuplicationException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("InventoryDuplication", details, reference);
  }
}
