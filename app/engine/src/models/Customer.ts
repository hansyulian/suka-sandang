import type {
  CustomerAttributes,
  CustomerCreationAttributes,
  CustomerStatus,
} from "@app/common";
import { Column, Table } from "sequelize-typescript";
import { BaseModel } from "~/models/BaseModel";

@Table({
  paranoid: true,
})
export class Customer extends BaseModel<
  CustomerAttributes,
  CustomerCreationAttributes
> {
  @Column
  declare name: string;

  @Column
  declare email?: string;

  @Column
  declare address?: string;

  @Column
  declare phone?: string;
  @Column
  declare identity?: string;

  @Column
  declare status: CustomerStatus;

  @Column
  declare remarks?: string;
}
