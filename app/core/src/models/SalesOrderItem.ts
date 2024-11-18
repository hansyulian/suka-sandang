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
import { BaseModel } from "~/models/BaseModel";
import { InventoryFlow } from "~/models/InventoryFlow";
import { Material } from "~/models/Material";
import { SalesOrder } from "~/models/SalesOrder";

@Table({
  paranoid: false,
})
export class SalesOrderItem extends BaseModel<
  SalesOrderItemAttributes,
  SalesOrderItemCreationAttributes
> {
  @Column
  declare quantity: number;

  @Column
  declare unitPrice: number;

  @ForeignKey(() => SalesOrder)
  @Column
  declare salesOrderId: string;

  @ForeignKey(() => Material)
  @Column
  declare materialId: string;

  @Column
  declare subTotal: number;

  @Column
  declare remarks?: string;

  @BelongsTo(() => SalesOrder, "salesOrderId")
  declare salesOrder: SalesOrder;

  @BelongsTo(() => Material)
  declare material: Material;

  @HasMany(() => InventoryFlow, "salesOrderItemId")
  declare inventoryFlows: InventoryFlow[];

  @BeforeCreate
  @BeforeUpdate
  static calculateSubTotal(instance: SalesOrderItem) {
    instance.subTotal = instance.quantity * instance.unitPrice;
  }
}
