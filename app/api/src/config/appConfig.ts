import { config } from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../../../.env");
config({ path: envPath });
const pe = process.env;
export const appConfig = {
  env: pe.NODE_ENV,
  debug: pe.API_DEBUG === "true",
  port: pe.API_PORT ? parseInt(pe.API_PORT) : 3000,
  jwtSecret: pe.JWT_SECRET ?? "supersecretjwtkey",
  jwtExpiry: parseInt(pe.JWT_EXPIRY || `${30 * 24 * 3600}`),
  jwtCookieKey: pe.API_JWT_COOKIE_KEY || "auth_token",
};
if (appConfig.debug) {
  console.log(appConfig);
}
