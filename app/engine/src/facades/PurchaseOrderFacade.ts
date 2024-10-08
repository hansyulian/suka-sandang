import {
  PurchaseOrderAttributes,
  PurchaseOrderCreationAttributes,
  PurchaseOrderUpdateAttributes,
  simpleSuccessResponse,
} from "@app/common";
import { compareArray } from "@hyulian/common";
import { WhereOptions } from "sequelize";
import { PurchaseOrderDuplicationException } from "~/exceptions/PurchaseOrderDuplicationException";
import { PurchaseOrderInvalidStatusException } from "~/exceptions/PurchaseOrderInvalidStatusException";
import { PurchaseOrderNotFoundException } from "~/exceptions/PurchaseOrderNotFoundException";
import { FacadeBase } from "~/facades/FacadeBase";
import { PurchaseOrder, PurchaseOrderItem } from "~/models";
import { SequelizePaginationOptions } from "~/types";
import { isUuid } from "~/utils/isUuid";

export class PurchaseOrderFacade extends FacadeBase {
  async list(
    query: WhereOptions<PurchaseOrderAttributes>,
    options: SequelizePaginationOptions
  ) {
    const result = await PurchaseOrder.findAndCountAll({
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
    const result = await PurchaseOrder.findByPk(id, {
      paranoid: false,
      include: [PurchaseOrderItem],
    });
    if (!result) {
      throw new PurchaseOrderNotFoundException({ id });
    }
    return result;
  }

  async findByIdOrCode(idOrCode: string) {
    const where: WhereOptions<PurchaseOrderAttributes> = isUuid(idOrCode)
      ? { id: idOrCode }
      : { code: idOrCode };
    const result = await PurchaseOrder.findOne({
      where,
      paranoid: false,
    });
    if (!result) {
      throw new PurchaseOrderNotFoundException({ idOrCode });
    }
    return result;
  }

  async create(data: PurchaseOrderCreationAttributes) {
    const { code, date, supplierId, remarks, status, items } = data;
    const recordByCode = await PurchaseOrder.findOne({
      where: { code },
      paranoid: true,
    });
    if (recordByCode) {
      throw new PurchaseOrderDuplicationException({ code });
    }
    const tm = await this.transactionManager();
    try {
      let total: number = 0;
      for (const item of items) {
        total += item.quantity * item.unitPrice;
      }
      const purchaseOrder = await PurchaseOrder.create(
        {
          code,
          date,
          supplierId,
          total,
          status,
          remarks,
        },
        {
          transaction: tm.transaction,
        }
      );
      const promises = [];
      for (const item of items) {
        const { materialId, quantity, unitPrice, remarks } = item;
        promises.push(
          PurchaseOrderItem.create(
            {
              materialId,
              quantity,
              unitPrice,
              remarks,
              purchaseOrderId: purchaseOrder.id,
              subTotal: quantity * unitPrice,
            },
            {
              transaction: tm.transaction,
            }
          )
        );
      }
      await Promise.all(promises);
      await tm.commit();
      return this.findById(purchaseOrder.id);
    } catch (err) {
      await tm.rollback();
      throw err;
    }
  }

  async update(id: string, data: PurchaseOrderUpdateAttributes) {
    const { date, remarks, status, items } = data;
    const record = await this.findById(id);
    if (record.status !== "pending") {
      throw new PurchaseOrderInvalidStatusException("pending", record.status);
    }
    const tm = await this.transactionManager();
    try {
      let total: number = 0;
      for (const item of items) {
        total += item.quantity * item.unitPrice;
      }
      const purchaseOrder = await record.update(
        {
          date,
          total,
          status,
          remarks,
        },
        {
          transaction: tm.transaction,
        }
      );
      const compareResult = compareArray(
        record.purchaseOrderItems,
        items,
        (left, right) => left.id === right.id
      );
      const promises = [];
      for (const leftOnly of compareResult.leftOnly) {
        promises.push(leftOnly.destroy());
      }
      for (const rightOnly of compareResult.rightOnly) {
        const { materialId, quantity, remarks, unitPrice } = rightOnly;
        promises.push(
          PurchaseOrderItem.create({
            purchaseOrderId: record.id,
            materialId,
            quantity,
            remarks,
            unitPrice,
            subTotal: quantity * unitPrice,
          })
        );
      }
      for (const itemUpdate of compareResult.both) {
        const { materialId, quantity, unitPrice, remarks } = itemUpdate.right;
        promises.push(
          itemUpdate.left.update({
            materialId,
            quantity,
            unitPrice,
            remarks,
            subTotal: quantity * unitPrice,
          })
        );
      }
      await Promise.all(promises);
      await tm.commit();
      return this.findById(purchaseOrder.id);
    } catch (err) {
      await tm.rollback();
      throw err;
    }
  }

  async delete(id: string) {
    const record = await this.findById(id);
    if (record.status !== "pending") {
      throw new PurchaseOrderInvalidStatusException("pending", record.status);
    }
    const tm = await this.transactionManager();
    try {
      await record.destroy({ transaction: tm.transaction });
      await tm.commit();
      return simpleSuccessResponse;
    } catch (err) {
      await tm.rollback();
      throw err;
    }
  }
}
