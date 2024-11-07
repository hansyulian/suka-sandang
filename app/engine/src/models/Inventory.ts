import type {
  InventoryAttributes,
  InventoryCreationAttributes,
  InventoryStatus,
} from "@app/common";
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Table,
} from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";
import { InventoryFlow } from "~/models/InventoryFlow";
import { Material } from "~/models/Material";

@Table({
  paranoid: true,
})
export class Inventory extends BaseModel<
  InventoryAttributes,
  Omit<InventoryCreationAttributes, "items">
> {
  @Column
  declare code: string;

  @Column
  declare total: number;

  @ForeignKey(() => Material)
  @Column
  declare materialId: string;

  @Column
  declare remarks?: string;

  @Column({
    defaultValue: "active",
  })
  declare status: InventoryStatus;

  @HasMany(() => InventoryFlow, "inventoryId")
  declare inventoryFlows: InventoryFlow[];
}
