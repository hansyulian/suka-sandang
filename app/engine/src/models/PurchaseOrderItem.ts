import type {
  PurchaseOrderItemAttributes,
  PurchaseOrderItemCreationAttributes,
} from "@app/common";
import {
  BeforeCreate,
  BeforeUpdate,
  BelongsTo,
  Column,
  ForeignKey,
  Table,
} from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";
import { Material } from "~/models/Material";
import { PurchaseOrder } from "~/models/PurchaseOrder";

@Table({
  paranoid: false,
})
export class PurchaseOrderItem extends BaseModel<
  PurchaseOrderItemAttributes,
  PurchaseOrderItemCreationAttributes
> {
  @Column
  declare quantity: number;

  @Column
  declare unitPrice: number;

  @ForeignKey(() => PurchaseOrder)
  @Column
  declare purchaseOrderId: string;

  @ForeignKey(() => Material)
  @Column
  declare materialId: string;

  @Column
  declare subTotal: number;

  @Column
  declare remarks?: string;

  @BelongsTo(() => PurchaseOrder, "purchaseOrderId")
  declare purchaseOrder: PurchaseOrder;

  @BelongsTo(() => Material)
  declare material: Material;

  @BeforeCreate
  @BeforeUpdate
  static calculateSubTotal(instance: PurchaseOrderItem) {
    instance.subTotal = instance.quantity * instance.unitPrice;
  }
}
