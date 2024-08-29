import { Order } from "sequelize";

export type QueryOptions = {
  limit?: number;
  offset?: number;
  order?: Order;
};

export type FindAndCountAllResult<T> = {
  records: T[];
  count: number;
};
