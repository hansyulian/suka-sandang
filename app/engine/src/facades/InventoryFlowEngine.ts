import type {
  InventoryFlowAttributes,
  InventoryFlowCreationAttributes,
  InventoryFlowUpdateAttributes,
} from "@app/common";
import { type WhereOptions } from "sequelize";
import { InventoryFlowInvalidActivityException } from "~/exceptions/InventoryFlowInvalidActivityException";
import { InventoryFlowInvalidQuantityException } from "~/exceptions/InventoryFlowInvalidQuantityException";
import { InventoryFlowNotFoundException } from "~/exceptions/InventoryFlowNotFoundException";
import { EngineBase } from "~/facades/EngineBase";
import { InventoryFlow, PurchaseOrder, PurchaseOrderItem } from "~/models";
import { WithTransaction } from "~/modules";
import type {
  SequelizeIncludeOptions,
  SequelizePaginationOptions,
} from "~/types";

export class InventoryFlowEngine extends EngineBase {
  @WithTransaction
  async list(
    query: WhereOptions<InventoryFlowAttributes>,
    options: SequelizePaginationOptions & SequelizeIncludeOptions
  ) {
    const result = await InventoryFlow.findAndCountAll({
      where: {
        ...query,
      },
      ...options,
      include: [
        {
          model: PurchaseOrderItem,
          include: [
            {
              model: PurchaseOrder,
            },
          ],
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
    const result = await InventoryFlow.findByPk(id, {
      ...options,
    });
    if (!result) {
      throw new InventoryFlowNotFoundException({ id });
    }
    return result;
  }

  @WithTransaction
  async create(data: InventoryFlowCreationAttributes) {
    const { inventoryId, quantity, remarks, activity } = data;
    let calculatedActivity = activity;
    await this.validateQuantity(quantity, inventoryId);
    const result = await InventoryFlow.create({
      inventoryId,
      quantity,
      remarks,
      activity: calculatedActivity,
    });
    await this.engine.inventory.recalculateTotal(inventoryId);
    return result;
  }

  @WithTransaction
  async validateQuantity(change: number, inventoryId: string) {
    const inventory = await this.engine.inventory.findById(inventoryId);
    const total = inventory.inventoryFlows.reduce(
      (prev, current) => prev + current.quantity,
      0
    );
    const newTotal = total + change;
    if (newTotal < 0) {
      throw new InventoryFlowInvalidQuantityException({
        max: total,
        attemptedChange: change,
        resultingTotal: newTotal,
      });
    }
    return {
      isFinished: newTotal === 0,
      newTotal,
      inventory,
    };
  }

  @WithTransaction
  async update(id: string, data: InventoryFlowUpdateAttributes) {
    const { quantity, remarks } = data;
    const record = await this.findById(id);
    if (remarks) {
      record.remarks = remarks;
    }
    if (quantity && quantity !== record.quantity) {
      if (InventoryFlow.updatableActivities.includes(record.activity)) {
        await this.validateQuantity(
          quantity - record.quantity,
          record.inventoryId
        );
        record.quantity = quantity;
      } else {
        throw new InventoryFlowInvalidActivityException(
          record.activity,
          InventoryFlow.updatableActivities
        );
      }
    }
    await record.save();
    await this.engine.inventory.recalculateTotal(record.inventoryId);
    return this.findById(id);
  }

  @WithTransaction
  async delete(id: string) {
    const record = await this.findById(id);
    if (!InventoryFlow.updatableActivities.includes(record.activity)) {
      throw new InventoryFlowInvalidActivityException(
        record.activity,
        InventoryFlow.updatableActivities
      );
    }
    await Promise.all([
      this.engine.inventory.recalculateTotal(record.inventoryId),
      record.destroy(),
    ]);
  }
}
