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
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";
import { InventoryFlow } from "~/models/InventoryFlow";
import { Material } from "~/models/Material";

@Table({
  paranoid: true,
})
export class Inventory extends BaseModel<
  InventoryAttributes,
  SequelizeCreationPreset<InventoryCreationAttributes> & { total?: number }
> {
  @Column
  declare code: string;

  @Column({
    defaultValue: 0,
  })
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

  @BelongsTo(() => Material, "materialId")
  declare material: Material;
}
