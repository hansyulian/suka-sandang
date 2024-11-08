import type {
  InventoryFlowActivity,
  InventoryFlowAttributes,
  InventoryFlowCreationAttributes,
  InventoryFlowUpdateAttributes,
} from "@app/common";
import { type WhereOptions } from "sequelize";
import { InventoryFlowInvalidActivityException } from "~/exceptions/InventoryFlowInvalidActivityException";
import { InventoryFlowInvalidQuantityException } from "~/exceptions/InventoryFlowInvalidQuantityException";
import { InventoryFlowNotFoundException } from "~/exceptions/InventoryFlowNotFoundException";
import { FacadeBase } from "~/facades/FacadeBase";
import { InventoryFlow, PurchaseOrder, PurchaseOrderItem } from "~/models";
import { WithTransaction } from "~/modules";
import { type SequelizePaginationOptions } from "~/types";

export class InventoryFlowFacade extends FacadeBase {
  @WithTransaction
  async list(
    query: WhereOptions<InventoryFlowAttributes>,
    options: SequelizePaginationOptions
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
  async findById(id: string) {
    const result = await InventoryFlow.findByPk(id);
    if (!result) {
      throw new InventoryFlowNotFoundException({ id });
    }
    return result;
  }

  @WithTransaction
  async create(data: InventoryFlowCreationAttributes) {
    const { inventoryId, quantity, purchaseOrderItemId, remarks, activity } =
      data;
    const record = await this.engine.inventory.findById(inventoryId);
    let calculatedActivity = activity;
    if (purchaseOrderItemId) {
      await this.engine.purchaseOrderItem.findById(purchaseOrderItemId);
      calculatedActivity = "sales";
    }
    if (record.total + quantity < 0) {
      throw new InventoryFlowInvalidQuantityException({
        max: record.total,
      });
    }
    const result = await InventoryFlow.create({
      inventoryId,
      quantity,
      purchaseOrderItemId,
      remarks,
      activity: calculatedActivity,
    });
    return result;
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
        record.quantity = quantity;
      } else {
        throw new InventoryFlowInvalidActivityException(
          record.activity,
          InventoryFlow.updatableActivities
        );
      }
    }
    await record.save();
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
    await record.destroy();
  }
}
