import { Column, Table } from "sequelize-typescript";

import { BaseAttributes, BaseModel, MutationOmit } from "./BaseModel";

export type UserStatus = "pending" | "active" | "suspended";
export type UserAttributes = BaseAttributes & {
  name: string;
  email: string;
  password: string;
  status: UserStatus;
};
export type UserCreationAttributes = MutationOmit<UserAttributes, "status">;
export type UserUpdateAttributes = MutationOmit<
  Partial<UserAttributes>,
  "status" | "email"
>;

@Table({
  paranoid: true,
})
export class User extends BaseModel<UserAttributes, UserCreationAttributes> {
  @Column
  declare name: string;

  @Column
  declare email: string;

  @Column
  declare password: string;

  @Column
  declare status: UserStatus;
}
