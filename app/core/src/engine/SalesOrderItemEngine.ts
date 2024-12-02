import type {
  SalesOrderItemAttributes,
  SalesOrderItemCreationAttributes,
  SalesOrderItemUpdateAttributes,
} from "@app/common";
import type { WhereOptions } from "sequelize";
import { SalesOrderInvalidStatusException } from "~/exceptions/SalesOrderInvalidStatusException";
import { SalesOrderItemNotFoundException } from "~/exceptions/SalesOrderItemNotFoundException";
import { EngineBase } from "~/engine/EngineBase";
import { SalesOrder, SalesOrderItem } from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import type { SequelizePaginationOptions } from "~/types";
import { InventoryInvalidStatusException } from "~/exceptions";

export class SalesOrderItemEngine extends EngineBase {
  @WithTransaction
  async list(
    query: WhereOptions<SalesOrderItemAttributes>,
    options: SequelizePaginationOptions
  ) {
    const result = await SalesOrderItem.findAndCountAll({
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

  @WithTransaction
  async findById(id: string) {
    const record = await SalesOrderItem.findByPk(id, {
      include: [SalesOrder],
    });
    if (!record) {
      throw new SalesOrderItemNotFoundException({ id });
    }
    return record;
  }

  @WithTransaction
  async create(data: SalesOrderItemCreationAttributes) {
    const { salesOrderId, inventoryId, quantity, unitPrice, remarks } = data;
    // just to find that sales order and inventory exists
    const salesOrder = await this.engine.salesOrder.findById(salesOrderId);
    if (salesOrder.status !== "draft") {
      throw new SalesOrderInvalidStatusException("draft", salesOrder.status);
    }
    const inventory = await this.engine.inventory.findById(inventoryId);
    if (inventory.status !== "active") {
      throw new InventoryInvalidStatusException("active", inventory.status);
    }
    const record = await SalesOrderItem.create({
      inventoryId,
      salesOrderId,
      quantity,
      unitPrice,
      remarks,
    });
    await this.engine.salesOrder.recalculateTotal(record.salesOrderId);
    return this.findById(record.id);
  }

  @WithTransaction
  async update(id: string, data: SalesOrderItemUpdateAttributes) {
    const { inventoryId, quantity, unitPrice, remarks } = data;
    const record = await this.findById(id);
    // just to find that purchase order and inventory exists
    if (inventoryId) {
      const inventory = await this.engine.inventory.findById(inventoryId);
      if (inventory.status !== "active") {
        throw new InventoryInvalidStatusException("active", inventory.status);
      }
    }
    await record.update({
      inventoryId,
      quantity,
      unitPrice,
      remarks,
    });
    await this.engine.salesOrder.recalculateTotal(record.salesOrderId);
    return this.findById(id);
  }

  @WithTransaction
  async delete(id: string) {
    const record = await this.findById(id);
    if (record.salesOrder.status !== "draft") {
      throw new SalesOrderInvalidStatusException(
        "draft",
        record.salesOrder.status
      );
    }

    await record.destroy();
  }
}
