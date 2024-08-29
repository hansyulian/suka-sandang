import { config } from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../../../.env");
config({ path: envPath });
const pe = process.env;
export const appConfig = {
  app: {
    port: pe.API_PORT ? parseInt(pe.API_PORT) : 3000,
    jwtSecret: pe.JWT_SECRET ?? "supersecretjwtkey",
    jwtExpiry: pe.JWT_EXPIRES_IN ?? "30d",
  },
};
