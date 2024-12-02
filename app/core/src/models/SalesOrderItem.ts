import type {
  SalesOrderItemAttributes,
  SalesOrderItemCreationAttributes,
} from "@app/common";
import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";
import { Inventory } from "~/models/Inventory";
import { InventoryFlow } from "~/models/InventoryFlow";
import { SalesOrder } from "~/models/SalesOrder";

export type SalesOrderItemSequelizeCreationAttributes =
  SequelizeCreationPreset<SalesOrderItemCreationAttributes>;
export type SalesOrderItemSequelizeBulkCreationAttributes =
  SequelizeCreationPreset<SalesOrderItemCreationAttributes> & {
    subTotal: number;
  };
@Table({
  paranoid: false,
})
export class SalesOrderItem extends BaseModel<
  SalesOrderItemAttributes,
  SalesOrderItemSequelizeCreationAttributes
> {
  @Column
  declare quantity: number;

  @Column
  declare unitPrice: number;

  @ForeignKey(() => SalesOrder)
  @Column
  declare salesOrderId: string;

  @ForeignKey(() => Inventory)
  @Column
  declare inventoryId: string;

  @Column
  declare subTotal: number;

  @Column
  declare remarks?: string;

  @BelongsTo(() => SalesOrder, "salesOrderId")
  declare salesOrder: SalesOrder;

  @BelongsTo(() => Inventory)
  declare inventory: Inventory;

  @HasMany(() => InventoryFlow, "salesOrderItemId")
  declare inventoryFlows: InventoryFlow[];

  @BeforeCreate
  @BeforeUpdate
  static calculateSubTotal(instance: SalesOrderItem) {
    instance.subTotal = instance.quantity * instance.unitPrice;
  }
}
