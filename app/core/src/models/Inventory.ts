import type {
  InventoryAttributes,
  InventoryCreationAttributes,
  InventoryStatus,
} from "@app/common";
import { sum } from "@hyulian/common";
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

export type InventorySequelizeCreationAttributes = SequelizeCreationPreset<
  InventoryCreationAttributes & { total?: number }
>;
@Table({
  paranoid: true,
})
export class Inventory extends BaseModel<
  InventoryAttributes,
  InventorySequelizeCreationAttributes
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

  async recalculateTotal(forceReloadFlows = false) {
    if (!this.inventoryFlows || forceReloadFlows) {
      this.inventoryFlows = await InventoryFlow.findAll({
        where: { inventoryId: this.id },
      });
    }
    this.total = sum(this.inventoryFlows, (record) => record.quantity);
    if (this.total === 0) {
      this.status = "finished";
    }
    await this.save();
    return this.total;
  }
}
