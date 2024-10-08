import type {
  PurchaseOrderAttributes,
  PurchaseOrderCreationAttributes,
  PurchaseOrderStatus,
} from "@app/common";
import {
  BeforeCreate,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";
import { PurchaseOrderItem } from "~/models/PurchaseOrderItem";
import { Supplier } from "~/models/Supplier";

@Table({
  paranoid: true,
})
export class PurchaseOrder extends BaseModel<
  PurchaseOrderAttributes,
  Omit<PurchaseOrderCreationAttributes, "items">
> {
  @Column
  declare date: Date;

  @Column
  declare code: string;

  @Column
  declare total: number;

  @ForeignKey(() => Supplier)
  @Column
  declare supplierId: string;

  @Column
  declare remarks?: string;

  @Column({
    defaultValue: "pending",
  })
  declare status: PurchaseOrderStatus;

  @BelongsTo(() => Supplier)
  declare supplier: Supplier;

  @HasMany(() => PurchaseOrderItem)
  declare purchaseOrderItems: PurchaseOrderItem[];
}
