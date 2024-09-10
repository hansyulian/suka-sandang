import { config } from "dotenv";
import path from "path";
import { Dialect } from "sequelize";

const envPath = path.resolve(__dirname, "../../../.env");
config({ path: envPath });
const pe = process.env;

export const appConfig = {
  app: {
    port: pe.API_PORT ? parseInt(pe.API_PORT) : 3000,
    salt: pe.HASH_SALT ? parseInt(pe.HASH_SALT) : 10,
    jwtSecret: pe.JWT_SECRET ?? "supersecretjwtkey",
    jwtExpiry: parseInt(pe.JWT_EXPIRY || `${30 * 24 * 3600}`),
    maximumRetrieval: parseInt(pe.MAXIMUM_RETRIEVAL || "100"),
  },
  database: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "app",
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT || "5432"),
    dialect: (process.env.DB_DIALECT || "postgresql") as Dialect,
  },
};
export type AppConfig = typeof appConfig;
