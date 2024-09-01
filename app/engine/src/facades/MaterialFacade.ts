import { Op, WhereOptions } from "sequelize";
import { FindAndCountAllResult, QueryOptions } from "~/types";
import { MaterialNotFoundException } from "~/exceptions/MaterialNotFoundException";
import {
  Material,
  MaterialCreationAttributes,
  MaterialUpdateAttributes,
} from "~/models/Material";
import { processQueryOptions } from "~/utils";

export const MaterialFacade = {
  list,
  findById,
  create,
  update,
  delete: remove,
};

export type MaterialQuery = {};

async function list(
  query: WhereOptions<Material>,
  options: QueryOptions
): Promise<FindAndCountAllResult<Material>> {
  const result = await Material.findAndCountAll({
    where: {
      status: {
        [Op.ne]: "deleted",
      },
      ...query,
    },
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

async function create(data: MaterialCreationAttributes) {
  const { code, name, purchasePrice, retailPrice } = data;
  const result = await Material.create({
    code,
    name,
    purchasePrice,
    retailPrice,
  });
  return result;
}

async function update(id: string, data: MaterialUpdateAttributes) {
  const record = await findById(id);
  const { code, name, purchasePrice, retailPrice } = data;
  const result = await record.update({
    code,
    name,
    retailPrice,
    purchasePrice,
  });
  return result;
}

async function remove(id: string) {
  const record = await findById(id);
  await record.destroy();
}
