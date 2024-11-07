import type {
  InventoryFlowActivity,
  InventoryFlowAttributes,
  InventoryFlowCreationAttributes,
  InventoryFlowStatus,
} from "@app/common";
import { BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";
import { Inventory } from "~/models/Inventory";
import { PurchaseOrder } from "~/models/PurchaseOrder";

@Table({
  paranoid: false,
})
export class InventoryFlow extends BaseModel<
  InventoryFlowAttributes,
  InventoryFlowCreationAttributes
> {
  @Column
  declare quantity: number;

  @ForeignKey(() => PurchaseOrder)
  @Column
  declare purchaseOrderId?: string;

  @ForeignKey(() => Inventory)
  @Column
  declare inventoryId: string;

  @Column
  declare remarks?: string;

  @Column({
    defaultValue: "valid",
  })
  declare status: InventoryFlowStatus;
  @Column({})
  declare activity: InventoryFlowActivity;

  @BelongsTo(() => PurchaseOrder, "purchaseOrderId")
  declare purchaseOrder: PurchaseOrder;

  @BelongsTo(() => Inventory)
  declare inventory: Inventory;
}
