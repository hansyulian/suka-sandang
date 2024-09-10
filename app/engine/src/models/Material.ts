import type {
  MaterialAttributes,
  MaterialCreationAttributes,
  MaterialStatus,
} from "@app/common";
import { Column, Table } from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";

@Table({
  paranoid: true,
})
export class Material extends BaseModel<
  MaterialAttributes,
  MaterialCreationAttributes
> {
  @Column
  declare name: string;

  @Column
  declare code: string;

  @Column
  declare purchasePrice?: number;

  @Column
  declare retailPrice?: number;

  @Column
  declare color?: string;

  @Column({
    defaultValue: "active",
  })
  declare status: MaterialStatus;

  @Column
  declare deletedAt: Date;
}
