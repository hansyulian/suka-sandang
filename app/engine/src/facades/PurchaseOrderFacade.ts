import {
  PurchaseOrderAttributes,
  PurchaseOrderCreationAttributes,
  PurchaseOrderUpdateAttributes,
} from "@app/common";
import { sum } from "@hyulian/common";
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
    const record = await PurchaseOrder.findByPk(id, {
      paranoid: false,
      include: [PurchaseOrderItem],
      transaction: this.transaction,
    });
    if (!record) {
      throw new PurchaseOrderNotFoundException({ id });
    }
    return record;
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
    const { code, date, supplierId, remarks, status } = data;
    const recordByCode = await PurchaseOrder.findOne({
      where: { code },
      paranoid: true,
    });
    if (recordByCode) {
      throw new PurchaseOrderDuplicationException({ code });
    }
    const record = await this.withTransaction((transaction) =>
      PurchaseOrder.create(
        {
          code,
          date,
          supplierId,
          status,
          remarks,
        },
        {
          transaction,
        }
      )
    );
    return this.findById(record.id);
  }

  async update(id: string, data: PurchaseOrderUpdateAttributes) {
    const { date, remarks, status } = data;
    const record = await this.findById(id);
    if (record.status !== "draft") {
      throw new PurchaseOrderInvalidStatusException("draft", record.status);
    }
    await this.withTransaction((transaction) =>
      record.update(
        {
          date,
          status,
          remarks,
        },
        {
          transaction,
        }
      )
    );
    return this.findById(id);
  }

  async delete(id: string) {
    const record = await this.findById(id);
    if (record.status !== "draft") {
      throw new PurchaseOrderInvalidStatusException("draft", record.status);
    }
    await this.withTransaction((transaction) =>
      record.destroy({ transaction })
    );
  }

  async recalculateTotal(id: string) {
    const record = await this.findById(id);
    const total = sum(record.purchaseOrderItems, (item) => item.subTotal);
    await this.withTransaction((transaction) =>
      record.update(
        {
          total,
        },
        { transaction }
      )
    );
  }
}
