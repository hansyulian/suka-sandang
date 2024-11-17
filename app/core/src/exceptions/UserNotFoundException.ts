import { Exception } from "@hyulian/common";

export class UserNotFoundException extends Exception {
  constructor(details: any = {}, reference?: string) {
    super("UserNotFound", details, reference);
  }
}
