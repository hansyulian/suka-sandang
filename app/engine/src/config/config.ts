import { Dialect } from "sequelize";
const pe = process.env;
export const appConfig = {
  app: {
    salt: pe.HASH_SALT ? parseInt(pe.HASH_SALT) : 10,
  },
  jwt: {
    secret: pe.JWT_SECRET ?? "supersecretjwtkey",
    expiry: parseInt(pe.JWT_EXPIRY || `${30 * 24 * 3600}`),
  },
  database: {
    username: pe.DB_USERNAME || "root",
    password: pe.DB_PASSWORD || "",
    database: pe.DB_DATABASE || "app",
    host: pe.DB_HOST || "127.0.0.1",
    port: parseInt(pe.DB_PORT || "5432"),
    dialect: (pe.DB_DIALECT || "postgresql") as Dialect,
    storage: pe.DB_STORAGE,
  },
};
export type AppConfig = typeof appConfig;
