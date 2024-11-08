import { Includeable, Order } from "sequelize";

export type SequelizePaginationOptions = {
  limit?: number;
  offset?: number;
  order?: Order;
};

export type SequelizeIncludeOptions = {
  include?: Includeable | Includeable[];
};

export type FindAndCountAllResult<T> = {
  records: T[];
  count: number;
};

export type FindAllResult<T> = {
  records: T[];
};

export { Op } from "sequelize";
