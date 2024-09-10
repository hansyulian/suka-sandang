import { BaseAttributes, MutationOmit } from "~/types/base";

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
