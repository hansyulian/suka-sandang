import { Exception } from "@hyulian/common";

export class InventoryNotFoundException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("InventoryNotFound", details, reference);
  }
}
