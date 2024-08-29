import { WhereOptions } from "sequelize";
import { FindAndCountAllResult, QueryOptions } from "~/@types/data";
import { MaterialNotFoundException } from "~/exceptions/MaterialNotFoundException";
import { Material } from "~/models/Material";
import { processQueryOptions } from "~/utils";

export const MaterialFacade = {
  list,
  findById,
  create,
  update,
  remove,
};

export type MaterialQuery = {};

async function list(
  query: WhereOptions<Material>,
  options: QueryOptions
): Promise<FindAndCountAllResult<Material>> {
  const result = await Material.findAndCountAll({
    where: query,
    ...processQueryOptions(options),
  });
  return {
    count: result.count,
    records: result.rows,
  };
}

async function findById(id: string) {
  const result = await Material.findByPk(id);
  if (!result) {
    throw new MaterialNotFoundException({ id });
  }
  return result;
}

async function create() {}

async function update() {}

async function remove() {}
