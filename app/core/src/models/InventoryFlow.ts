import type {
  InventoryFlowActivity,
  InventoryFlowAttributes,
  InventoryFlowCreationAttributes,
  InventoryFlowStatus,
} from "@app/common";
import { BelongsTo, Column, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";
import { Inventory } from "~/models/Inventory";
import { PurchaseOrderItem } from "~/models/PurchaseOrderItem";
import { SalesOrderItem } from "~/models/SalesOrderItem";

@Table({
  paranoid: false,
})
export class InventoryFlow extends BaseModel<
  InventoryFlowAttributes,
  SequelizeCreationPreset<
    InventoryFlowCreationAttributes & { purchaseOrderItemId?: string }
  >
> {
  @Column
  declare quantity: number;

  @ForeignKey(() => PurchaseOrderItem)
  @Column
  declare purchaseOrderItemId?: string;

  @ForeignKey(() => SalesOrderItem)
  @Column
  declare salesOrderItemId?: string;

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

  @BelongsTo(() => PurchaseOrderItem, "purchaseOrderItemId")
  declare purchaseOrderItem: PurchaseOrderItem;

  @BelongsTo(() => SalesOrderItem, "salesOrderItemId")
  declare salesOrderItem: SalesOrderItem;

  @BelongsTo(() => Inventory)
  declare inventory: Inventory;

  static get updatableActivities() {
    return ["adjustment", "scrap", "transfer"] as InventoryFlowActivity[];
  }
}
