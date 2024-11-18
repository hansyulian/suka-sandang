import type {
  SalesOrderItemAttributes,
  SalesOrderItemCreationAttributes,
  SalesOrderItemUpdateAttributes,
} from "@app/common";
import type { WhereOptions } from "sequelize";
import { MaterialInvalidStatusException } from "~/exceptions/MaterialInvalidStatusException";
import { SalesOrderInvalidStatusException } from "~/exceptions/SalesOrderInvalidStatusException";
import { SalesOrderItemNotFoundException } from "~/exceptions/SalesOrderItemNotFoundException";
import { EngineBase } from "~/engine/EngineBase";
import { SalesOrder, SalesOrderItem } from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import type { SequelizePaginationOptions } from "~/types";

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
    const { salesOrderId, materialId, quantity, unitPrice, remarks } = data;
    // just to find that purchase order and material exists
    const salesOrder = await this.engine.salesOrder.findById(salesOrderId);
    if (salesOrder.status !== "draft") {
      throw new SalesOrderInvalidStatusException("draft", salesOrder.status);
    }
    const material = await this.engine.material.findById(materialId);
    if (material.status !== "active") {
      throw new MaterialInvalidStatusException("active", material.status);
    }
    const record = await SalesOrderItem.create({
      materialId,
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
    const { materialId, quantity, unitPrice, remarks } = data;
    const record = await this.findById(id);
    // just to find that purchase order and material exists
    if (materialId) {
      const material = await this.engine.material.findById(materialId);
      if (material.status !== "active") {
        throw new MaterialInvalidStatusException("active", material.status);
      }
    }
    await record.update({
      materialId,
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
