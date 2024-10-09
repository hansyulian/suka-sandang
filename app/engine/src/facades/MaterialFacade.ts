import { WhereOptions } from "sequelize";
import { FindAndCountAllResult, SequelizePaginationOptions } from "~/types";
import { MaterialNotFoundException } from "~/exceptions/MaterialNotFoundException";
import { Material } from "~/models/Material";
import {
  MaterialAttributes,
  MaterialCreationAttributes,
  MaterialUpdateAttributes,
} from "@app/common";
import { isUuid } from "~/utils/isUuid";
import { MaterialDuplicationException } from "~/exceptions/MaterialDuplicationException";
import { FacadeBase } from "~/facades/FacadeBase";

export class MaterialFacade extends FacadeBase {
  async list(
    query: WhereOptions<MaterialAttributes>,
    options: SequelizePaginationOptions
  ): Promise<FindAndCountAllResult<Material>> {
    const result = await Material.findAndCountAll({
      where: {
        ...query,
      },
      ...options,
    });
    return {
      count: result.count,
      records: result.rows,
    };
  }

  async findById(id: string) {
    const record = await Material.findByPk(id, { paranoid: false });
    if (!record) {
      throw new MaterialNotFoundException({ id });
    }
    return record;
  }

  async findByIdOrCode(idOrCode: string) {
    const where: WhereOptions<MaterialAttributes> = isUuid(idOrCode)
      ? { id: idOrCode }
      : { code: idOrCode };
    const record = await Material.findOne({
      where,
      paranoid: false,
    });
    if (!record) {
      throw new MaterialNotFoundException({ idOrCode });
    }
    return record;
  }

  async create(data: MaterialCreationAttributes) {
    const { code, name, purchasePrice, retailPrice, status, color } = data;
    const recordByCode = await Material.findOne({ where: { code } });
    if (recordByCode) {
      throw new MaterialDuplicationException({ code });
    }
    const result = await this.withTransaction((transaction) =>
      Material.create(
        {
          code,
          name,
          purchasePrice,
          retailPrice,
          status,
          color,
        },
        { transaction }
      )
    );
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
    const result = await this.withTransaction(async (transaction) => {
      if (status && status !== "deleted") {
        await record.restore({ transaction });
      }
      return await record.update(
        {
          code,
          name,
          retailPrice,
          purchasePrice,
          color,
          status,
        },
        { transaction }
      );
    });
    return Material.findByPk(result.id, { paranoid: false });
  }

  async delete(id: string) {
    const record = await this.findById(id);
    await this.withTransaction((transaction) =>
      record.destroy({ transaction })
    );
  }
}
