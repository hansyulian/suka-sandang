import { Dialect } from "sequelize";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { appConfig } from "~/config";

import { User } from "./models";
import { Material } from "~/models/Material";

type DBConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
  storage?: string;
  logging?: "console";
};

export function setupDatabase(
  dbConfig: DBConfig = appConfig.database,
  sequelizeOptions: Partial<SequelizeOptions> = {}
) {
  const logging = dbConfig.logging === "console" ? console.log : () => {};
  const sequelizeConfig: SequelizeOptions = {
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    logging,
    models: [User, Material],
    ...sequelizeOptions,
  };
  const sequelize = new Sequelize(sequelizeConfig);
  return sequelize;
}
