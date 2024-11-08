import type {
  InventoryAttributes,
  InventoryCreationAttributes,
  InventoryUpdateAttributes,
} from "@app/common";
import { sum } from "@hyulian/common";
import { type WhereOptions } from "sequelize";
import { InventoryDuplicationException } from "~/exceptions/InventoryDuplicationException";
import { InventoryNotFoundException } from "~/exceptions/InventoryNotFoundException";
import { FacadeBase } from "~/facades/FacadeBase";
import { Material, Inventory, InventoryFlow } from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import type {
  SequelizeIncludeOptions,
  SequelizePaginationOptions,
} from "~/types";
import { isUuid } from "~/utils/isUuid";

export class InventoryFacade extends FacadeBase {
  @WithTransaction
  async list(
    query: WhereOptions<InventoryAttributes>,
    options: SequelizePaginationOptions & SequelizeIncludeOptions
  ) {
    const result = await Inventory.findAndCountAll({
      where: {
        ...query,
      },
      ...options,
      include: [
        {
          model: Material,
        },
      ],
    });
    return {
      count: result.count,
      records: result.rows,
    };
  }

  @WithTransaction
  async findById(id: string, options: SequelizeIncludeOptions = {}) {
    const record = await Inventory.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: Material,
        },
        {
          model: InventoryFlow,
        },
      ],
      ...options,
    });
    if (!record) {
      throw new InventoryNotFoundException({ id });
    }
    return record;
  }

  @WithTransaction
  async findByIdOrCode(
    idOrCode: string,
    options: SequelizeIncludeOptions = {}
  ) {
    const where: WhereOptions<InventoryAttributes> = isUuid(idOrCode)
      ? { id: idOrCode }
      : { code: idOrCode };
    const result = await Inventory.findOne({
      where,
      paranoid: false,
      include: [
        {
          model: Material,
        },
        {
          model: InventoryFlow,
        },
      ],
      ...options,
    });
    if (!result) {
      throw new InventoryNotFoundException({ idOrCode });
    }
    return result;
  }

  @WithTransaction
  async create(data: InventoryCreationAttributes) {
    const { id, code, materialId, remarks } = data;
    const recordByCode = await Inventory.findOne({
      where: { code },
      paranoid: true,
    });
    if (recordByCode) {
      throw new InventoryDuplicationException({ code });
    }
    const record = await Inventory.create({
      code,
      materialId,
      id,
      remarks,
    });
    return this.findById(record.id);
  }

  @WithTransaction
  async update(id: string, data: InventoryUpdateAttributes) {
    const { remarks } = data;
    const record = await this.findById(id);
    await record.update({
      remarks,
    });
    return this.findById(id);
  }

  @WithTransaction
  async delete(id: string) {
    const record = await this.findById(id, { include: undefined });
    await record.destroy();
  }

  @WithTransaction
  async recalculateTotal(id: string) {
    const record = await this.findById(id);
    const total = sum(record.inventoryFlows, (item) => item.quantity);
    await record.update({
      total,
    });
  }
}
