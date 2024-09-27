import { WhereOptions } from "sequelize";
import { FindAndCountAllResult, SequelizePaginationOptions } from "~/types";
import { MaterialNotFoundException } from "~/exceptions/MaterialNotFoundException";
import { Material } from "~/models/Material";
import { processQueryOptions } from "~/utils";
import {
  MaterialCreationAttributes,
  MaterialUpdateAttributes,
} from "@app/common";
import { isUuid } from "~/utils/isUuid";
import { MaterialDuplicationException } from "~/exceptions/MaterialDuplicationException";
import { FacadeBase } from "~/facades/FacadeBase";

export class MaterialFacade extends FacadeBase {
  async list(
    query: WhereOptions<Material>,
    options: SequelizePaginationOptions
  ): Promise<FindAndCountAllResult<Material>> {
    const result = await Material.findAndCountAll({
      where: {
        ...query,
      },
      ...processQueryOptions(options),
    });
    return {
      count: result.count,
      records: result.rows,
    };
  }

  async findById(id: string) {
    const result = await Material.findByPk(id, { paranoid: false });
    if (!result) {
      throw new MaterialNotFoundException({ id });
    }
    return result;
  }

  async findByIdOrCode(idOrCode: string) {
    const where: WhereOptions<Material> = isUuid(idOrCode)
      ? { id: idOrCode }
      : { code: idOrCode };
    const result = await Material.findOne({
      where,
      paranoid: false,
    });
    if (!result) {
      throw new MaterialNotFoundException({ idOrCode });
    }
    return result;
  }

  async create(data: MaterialCreationAttributes) {
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

  async update(id: string, data: MaterialUpdateAttributes) {
    const record = await this.findById(id);
    const { code, name, purchasePrice, retailPrice, status, color } = data;
    if (code && record.code !== code) {
      const recordByCode = await Material.findOne({
        where: { code },
        paranoid: false,
      });
      if (recordByCode) {
        throw new MaterialDuplicationException({ code });
      }
    }
    if (status && status !== "deleted") {
      await record.restore({});
    }
    const result = await record.update({
      code,
      name,
      retailPrice,
      purchasePrice,
      color,
      status,
    });
    return Material.findByPk(result.id, { paranoid: false });
  }

  async delete(id: string) {
    const record = await this.findById(id);
    record.status = "deleted";
    await record.save();
    await record.destroy();
  }
}

// export const MaterialFacade = {
//   list,
//   findById,
//   findByIdOrCode,
//   create,
//   update,
//   delete: remove,
// };

// async function list(
//   query: WhereOptions<Material>,
//   options: LiteQueryOptions
// ): Promise<FindAndCountAllResult<Material>> {
//   const result = await Material.findAndCountAll({
//     where: {
//       ...query,
//     },
//     ...processQueryOptions(options),
//   });
//   return {
//     count: result.count,
//     records: result.rows,
//   };
// }

// async function findById(id: string) {
//   const result = await Material.findByPk(id, { paranoid: false });
//   if (!result) {
//     throw new MaterialNotFoundException({ id });
//   }
//   return result;
// }

// async function findByIdOrCode(idOrCode: string) {
//   const where: WhereOptions<Material> = isUuid(idOrCode)
//     ? { id: idOrCode }
//     : { code: idOrCode };
//   const result = await Material.findOne({
//     where,
//     paranoid: false,
//   });
//   if (!result) {
//     throw new MaterialNotFoundException({ idOrCode });
//   }
//   return result;
// }

// async function create(data: MaterialCreationAttributes) {
//   const { code, name, purchasePrice, retailPrice, status, color } = data;
//   const recordByCode = await Material.findOne({ where: { code } });
//   if (recordByCode) {
//     throw new MaterialDuplicationException({ code });
//   }
//   const result = await Material.create({
//     code,
//     name,
//     purchasePrice,
//     retailPrice,
//     status,
//     color,
//   });
//   return Material.findByPk(result.id);
// }

// async function update(id: string, data: MaterialUpdateAttributes) {
//   const record = await findById(id);
//   const { code, name, purchasePrice, retailPrice, status, color } = data;
//   if (code && record.code !== code) {
//     const recordByCode = await Material.findOne({
//       where: { code },
//       paranoid: false,
//     });
//     if (recordByCode) {
//       throw new MaterialDuplicationException({ code });
//     }
//   }
//   if (status && status !== "deleted") {
//     await record.restore({});
//   }
//   const result = await record.update({
//     code,
//     name,
//     retailPrice,
//     purchasePrice,
//     color,
//     status,
//   });
//   return Material.findByPk(result.id, { paranoid: false });
// }

// async function remove(id: string) {
//   const record = await findById(id);
//   record.status = "deleted";
//   await record.save();
//   await record.destroy();
// }
