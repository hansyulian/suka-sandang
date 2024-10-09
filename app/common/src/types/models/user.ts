import { BaseAttributes, CreateOmit, UpdateOmit } from "~/types/models/base";

export type UserStatus = "draft" | "active" | "suspended";
export type UserAttributes = BaseAttributes & {
  name: string;
  email: string;
  password: string;
  status: UserStatus;
};
export type UserCreationAttributes = CreateOmit<UserAttributes, "status">;
export type UserUpdateAttributes = UpdateOmit<
  Partial<UserAttributes>,
  "status" | "email"
>;
