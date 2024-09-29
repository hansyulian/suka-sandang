import { Order } from "sequelize";

export type SequelizePaginationOptions = {
  limit?: number;
  offset?: number;
  order?: Order;
};

export type FindAndCountAllResult<T> = {
  records: T[];
  count: number;
};

export type FindAllResult<T> = {
  records: T[];
};

export { Op } from "sequelize";
