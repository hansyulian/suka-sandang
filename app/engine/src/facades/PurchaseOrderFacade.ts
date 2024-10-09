import type {
  PurchaseOrderAttributes,
  PurchaseOrderCreationAttributes,
  PurchaseOrderUpdateAttributes,
} from "@app/common";
import { sum } from "@hyulian/common";
import type { WhereOptions } from "sequelize";
import { PurchaseOrderDuplicationException } from "~/exceptions/PurchaseOrderDuplicationException";
import { PurchaseOrderInvalidStatusException } from "~/exceptions/PurchaseOrderInvalidStatusException";
import { PurchaseOrderNotFoundException } from "~/exceptions/PurchaseOrderNotFoundException";
import { FacadeBase } from "~/facades/FacadeBase";
import { PurchaseOrder, PurchaseOrderItem } from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import type { SequelizePaginationOptions } from "~/types";
import { isUuid } from "~/utils/isUuid";

export class PurchaseOrderFacade extends FacadeBase {
  @WithTransaction
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

  @WithTransaction
  async findById(id: string) {
    const record = await PurchaseOrder.findByPk(id, {
      paranoid: false,
      include: [PurchaseOrderItem],
    });
    if (!record) {
      throw new PurchaseOrderNotFoundException({ id });
    }
    return record;
  }

  @WithTransaction
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

  @WithTransaction
  async create(data: PurchaseOrderCreationAttributes) {
    const { code, date, supplierId, remarks, status } = data;
    const recordByCode = await PurchaseOrder.findOne({
      where: { code },
      paranoid: true,
    });
    if (recordByCode) {
      throw new PurchaseOrderDuplicationException({ code });
    }
    const record = await PurchaseOrder.create({
      code,
      date,
      supplierId,
      status,
      remarks,
    });
    return this.findById(record.id);
  }

  @WithTransaction
  async update(id: string, data: PurchaseOrderUpdateAttributes) {
    const { date, remarks, status } = data;
    const record = await this.findById(id);
    if (record.status !== "draft") {
      throw new PurchaseOrderInvalidStatusException("draft", record.status);
    }
    await record.update({
      date,
      status,
      remarks,
    });
    return this.findById(id);
  }

  @WithTransaction
  async delete(id: string) {
    const record = await this.findById(id);
    if (record.status !== "draft") {
      throw new PurchaseOrderInvalidStatusException("draft", record.status);
    }
    await record.destroy();
  }

  @WithTransaction
  async recalculateTotal(id: string) {
    const record = await this.findById(id);
    const total = sum(record.purchaseOrderItems, (item) => item.subTotal);
    await record.update({
      total,
    });
  }
}
