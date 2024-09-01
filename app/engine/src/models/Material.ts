import { Column, Table } from "sequelize-typescript";

import { BaseAttributes, BaseModel, MutationOmit } from "./BaseModel";

export const materialStatuses = ["pending", "active", "inactive"] as const;
export type MaterialStatus = (typeof materialStatuses)[number];
export type MaterialAttributes = BaseAttributes & {
  name: string;
  code: string;
  status: MaterialStatus;
  purchasePrice?: number;
  retailPrice?: number;
  deletedAt?: Date;
};
export type MaterialCreationAttributes = MutationOmit<
  MaterialAttributes,
  "status"
>;
export type MaterialUpdateAttributes = MutationOmit<
  Partial<MaterialAttributes>,
  "status"
>;
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

  @Column({
    defaultValue: "active",
  })
  declare status: MaterialStatus;

  @Column
  declare deletedAt: Date;
}
