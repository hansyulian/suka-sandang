import { Exception } from "@hyulian/common";
import { Inventory } from "~/models";

export class InventoryInsufficientQuantityException extends Exception {
  constructor(inventory: Inventory, quantity: number, reference?: string) {
    super(
      "InventoryInsufficientQuantity",
      {
        existing: inventory.total,
        requested: quantity,
      },
      reference
    );
  }
}
