const { config } = require("dotenv");
const path = require("path");
const relativeRoot = "../../../";

const pe = process.env;
const envFile = pe.NODE_ENV === "test" ? ".test" : "";
const envPath = path.resolve(__dirname, `${relativeRoot}.env${envFile}`);
config({ path: envPath });

const databaseConfig = {
  username: pe.DB_USERNAME,
  password: pe.DB_PASSWORD,
  database: pe.DB_DATABASE,
  host: pe.DB_HOST,
  port: pe.DB_PORT,
  dialect: pe.DB_DIALECT,
  storage: pe.DB_STORAGE,
};

console.log("database configuration", databaseConfig);
module.exports = databaseConfig;
