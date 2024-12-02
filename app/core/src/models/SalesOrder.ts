import type {
  SalesOrderAttributes,
  SalesOrderCreationAttributes,
  SalesOrderStatus,
} from "@app/common";
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";
import { SalesOrderItem } from "~/models/SalesOrderItem";
import { Customer } from "~/models/Customer";

export type SalesOrderSequelizeCreationAttributes =
  SequelizeCreationPreset<SalesOrderCreationAttributes>;
@Table({
  paranoid: true,
})
export class SalesOrder extends BaseModel<
  SalesOrderAttributes,
  SalesOrderSequelizeCreationAttributes
> {
  @Column
  declare date: Date;

  @Column
  declare code: string;

  @Column
  declare total: number;

  @ForeignKey(() => Customer)
  @Column
  declare customerId: string;

  @Column
  declare remarks?: string;

  @Column({
    defaultValue: "draft",
  })
  declare status: SalesOrderStatus;

  @BelongsTo(() => Customer, "customerId")
  declare customer: Customer;

  @HasMany(() => SalesOrderItem, "salesOrderId")
  declare salesOrderItems: SalesOrderItem[];
}
