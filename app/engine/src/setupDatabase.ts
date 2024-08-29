import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { appConfig } from "~/config";

import { User } from "./models";

type DBConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
  logging?: "console";
};

export async function setupDatabase(dbConfig: DBConfig = appConfig.database) {
  const logging = dbConfig.logging === "console" ? console.log : () => {};
  const sequelize = new Sequelize({
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging,
    models: [User],
  });
  return sequelize;
}
