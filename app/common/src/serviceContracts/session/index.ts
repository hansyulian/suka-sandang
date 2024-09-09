import { EmailLoginContract } from "./EmailLogin";
import { GetUserInfoContract } from "./GetUserInfo";
import { UpdateUserInfoContract } from "./UpdateUserInfo";
import { LogoutContract } from "./Logout";

export * from "./GetUserInfo";
export * from "./EmailLogin";
export * from "./UpdateUserInfo";
export * from "./Logout";
export namespace SessionContracts {
  export type GetUserInfo = GetUserInfoContract;
  export type EmailLogin = EmailLoginContract;
  export type UpdateUserInfo = UpdateUserInfoContract;
  export type Logout = LogoutContract;
}
