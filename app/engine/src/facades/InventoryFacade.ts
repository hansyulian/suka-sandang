import type {
  InventoryAttributes,
  InventoryCreationAttributes,
  InventoryFlowSyncAttributes,
  InventoryUpdateAttributes,
} from "@app/common";
import { compareArray } from "@hyulian/common";
import { type WhereOptions } from "sequelize";
import { InventoryInvalidStatusException } from "~/exceptions";
import { InvalidInventoryTotalException } from "~/exceptions/InvalidInventoryTotalException";
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
    const { code, materialId, remarks } = data;
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
      remarks,
    });
    return this.findById(record.id);
  }

  @WithTransaction
  async update(
    id: string,
    data: InventoryUpdateAttributes & { items?: InventoryFlowSyncAttributes[] }
  ) {
    const { remarks, items } = data;
    const record = await this.findById(id);
    await record.update({
      remarks,
    });
    if (items) {
      await this.sync(id, items);
    }
    return this.findById(id);
  }

  @WithTransaction
  async sync(id: string, records: InventoryFlowSyncAttributes[]) {
    const record = await this.findById(id);
    if (record.status !== "active") {
      throw new InventoryInvalidStatusException("active", record.status);
    }
    const promises = [];
    const { inventoryFlows } = record;
    const compareResult = compareArray(
      inventoryFlows,
      records,
      (left, right) => left.id === right.id
    );
    for (const record of compareResult.leftOnly) {
      if (InventoryFlow.updatableActivities.includes(record.activity)) {
        promises.push(record.destroy());
      }
    }
    for (const record of compareResult.rightOnly) {
      const { activity, quantity, remarks } = record;
      if (InventoryFlow.updatableActivities.includes(activity)) {
        promises.push(
          InventoryFlow.create({
            activity,
            inventoryId: id,
            quantity,
            id: record.id,
            remarks,
          })
        );
      }
    }
    for (const record of compareResult.both) {
      const { activity } = record.left;
      const { quantity, remarks } = record.right;
      if (InventoryFlow.updatableActivities.includes(activity)) {
        if (activity) {
          record.left.activity = record.right.activity;
        }
        if (quantity) {
          record.left.quantity = quantity;
        }
      }
      record.left.remarks = remarks;
      promises.push(record.left.save());
    }
    await Promise.all(promises);
    const newTotal = await record.recalculateTotal(true);
    if (newTotal < 0) {
      throw new InvalidInventoryTotalException({ total: newTotal });
    }
  }

  @WithTransaction
  async delete(id: string) {
    const record = await this.findById(id, { include: undefined });
    await record.destroy();
  }

  @WithTransaction
  async recalculateTotal(id: string) {
    const record = await this.findById(id);
    await record.recalculateTotal();
  }
}
