import { Op, WhereOptions } from "sequelize";
import { FindAndCountAllResult, QueryOptions } from "~/types";
import { MaterialNotFoundException } from "~/exceptions/MaterialNotFoundException";
import { Material } from "~/models/Material";
import { processQueryOptions } from "~/utils";
import {
  MaterialCreationAttributes,
  MaterialUpdateAttributes,
} from "@app/common";
import { isUuid } from "~/utils/isUuid";
import { MaterialDuplicationException } from "~/exceptions/MaterialDuplicationException";

export const MaterialFacade = {
  list,
  findById,
  findByIdOrCode,
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

async function findByIdOrCode(idOrCode: string) {
  const where: WhereOptions<Material> = isUuid(idOrCode)
    ? { id: idOrCode }
    : { code: idOrCode };
  const result = await Material.findOne({
    where,
  });
  if (!result) {
    throw new MaterialNotFoundException({ idOrCode });
  }
  return result;
}

async function create(data: MaterialCreationAttributes) {
  const { code, name, purchasePrice, retailPrice, status, color } = data;
  const recordByCode = await Material.findOne({ where: { code } });
  if (recordByCode) {
    throw new MaterialDuplicationException({ code });
  }
  const result = await Material.create({
    code,
    name,
    purchasePrice,
    retailPrice,
    status,
    color,
  });
  return Material.findByPk(result.id);
}

async function update(id: string, data: MaterialUpdateAttributes) {
  const record = await findById(id);
  const { code, name, purchasePrice, retailPrice, status, color } = data;
  if (record.code !== code) {
    const recordByCode = await Material.findOne({ where: { code } });
    if (recordByCode) {
      throw new MaterialDuplicationException({ code });
    }
  }
  const result = await record.update({
    code,
    name,
    retailPrice,
    purchasePrice,
    color,
    status,
  });
  return Material.findByPk(result.id);
}

async function remove(id: string) {
  const record = await findById(id);
  await record.destroy();
}
