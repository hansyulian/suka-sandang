// using esm, for some reason i have to do 'export' in order for the typing to be recognized
import { User } from "@app/engine";
import "@hyulian/express-api-contract";

export declare global {
  namespace Atlas {
    interface Locals {
      user: User;
    }
  }
}
