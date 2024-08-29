import bcrypt from "bcrypt";
import { appConfig } from "~/config";

export async function hashPassword(value: string) {
  return bcrypt.hash(value, appConfig.app.salt);
}
