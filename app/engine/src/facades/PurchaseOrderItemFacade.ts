import type {
  PurchaseOrderItemAttributes,
  PurchaseOrderItemCreationAttributes,
  PurchaseOrderItemUpdateAttributes,
} from "@app/common";
import type { WhereOptions } from "sequelize";
import { MaterialInvalidStatusException } from "~/exceptions/MaterialInvalidStatusException";
import { PurchaseOrderInvalidStatusException } from "~/exceptions/PurchaseOrderInvalidStatusException";
import { PurchaseOrderItemNotFoundException } from "~/exceptions/PurchaseOrderItemNotFoundException";
import { FacadeBase } from "~/facades/FacadeBase";
import { PurchaseOrder, PurchaseOrderItem } from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import type { SequelizePaginationOptions } from "~/types";

export class PurchaseOrderItemFacade extends FacadeBase {
  @WithTransaction
  async list(
    query: WhereOptions<PurchaseOrderItemAttributes>,
    options: SequelizePaginationOptions
  ) {
    const result = await PurchaseOrderItem.findAndCountAll({
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
    const record = await PurchaseOrderItem.findByPk(id, {
      include: [PurchaseOrder],
    });
    if (!record) {
      throw new PurchaseOrderItemNotFoundException({ id });
    }
    return record;
  }

  @WithTransaction
  async create(data: PurchaseOrderItemCreationAttributes) {
    const { purchaseOrderId, materialId, quantity, unitPrice, remarks } = data;
    // just to find that purchase order and material exists
    const purchaseOrder = await this.engine.purchaseOrder.findById(
      purchaseOrderId
    );
    if (purchaseOrder.status !== "draft") {
      throw new PurchaseOrderInvalidStatusException(
        "draft",
        purchaseOrder.status
      );
    }
    const material = await this.engine.material.findById(materialId);
    if (material.status !== "active") {
      throw new MaterialInvalidStatusException("active", material.status);
    }
    const record = await PurchaseOrderItem.create({
      materialId,
      purchaseOrderId,
      quantity,
      unitPrice,
      remarks,
    });
    await this.engine.purchaseOrder.recalculateTotal(record.purchaseOrderId);
    return this.findById(record.id);
  }

  @WithTransaction
  async update(id: string, data: PurchaseOrderItemUpdateAttributes) {
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
    await this.engine.purchaseOrder.recalculateTotal(record.purchaseOrderId);
    return this.findById(id);
  }

  @WithTransaction
  async delete(id: string) {
    const record = await this.findById(id);
    if (record.purchaseOrder.status !== "draft") {
      throw new PurchaseOrderInvalidStatusException(
        "draft",
        record.purchaseOrder.status
      );
    }

    await record.destroy();
  }
}
