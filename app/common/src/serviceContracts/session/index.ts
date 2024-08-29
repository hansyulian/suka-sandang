import { EmailLoginContract } from './EmailLogin';
import { GetUserInfoContract } from './GetUserInfo';

export * from './GetUserInfo';
export * from './EmailLogin';
export namespace SessionContracts {
  export type GetUserInfo = GetUserInfoContract;
  export type LoginWithEmailAndPassword = EmailLoginContract;
}
