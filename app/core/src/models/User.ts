import type {
  UserAttributes,
  UserCreationAttributes,
  UserStatus,
} from "@app/common";
import { Column, Table } from "sequelize-typescript";
import { BaseModel, SequelizeCreationPreset } from "~/models/BaseModel";

export type UserSequelizeCreationAttributes =
  SequelizeCreationPreset<UserCreationAttributes>;

@Table({
  paranoid: true,
})
export class User extends BaseModel<
  UserAttributes,
  UserSequelizeCreationAttributes
> {
  @Column
  declare name: string;

  @Column
  declare email: string;

  @Column
  declare password: string;

  @Column
  declare status: UserStatus;
}
