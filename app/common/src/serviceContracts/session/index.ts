import { EmailLoginContract } from "./EmailLogin";
import { GetUserInfoContract } from "./GetUserInfo";
import { UpdateUserInfoContract } from "./UpdateUserInfo";

export * from "./GetUserInfo";
export * from "./EmailLogin";
export * from "./UpdateUserInfo";
export namespace SessionContracts {
  export type GetUserInfo = GetUserInfoContract;
  export type EmailLogin = EmailLoginContract;
  export type UpdateUserInfo = UpdateUserInfoContract;
}
