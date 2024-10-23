import type {
  PurchaseOrderAttributes,
  PurchaseOrderCreationAttributes,
  PurchaseOrderItemCreationAttributes,
  PurchaseOrderItemSyncAttributes,
  PurchaseOrderItemUpdateAttributes,
  PurchaseOrderUpdateAttributes,
} from "@app/common";
import { compareArray, filterDuplicates, sum } from "@hyulian/common";
import { Op, type WhereOptions } from "sequelize";
import { MaterialNotFoundException } from "~/exceptions";
import { MaterialInvalidStatusException } from "~/exceptions/MaterialInvalidStatusException";
import { PurchaseOrderDuplicationException } from "~/exceptions/PurchaseOrderDuplicationException";
import { PurchaseOrderInvalidStatusException } from "~/exceptions/PurchaseOrderInvalidStatusException";
import { PurchaseOrderNotFoundException } from "~/exceptions/PurchaseOrderNotFoundException";
import { FacadeBase } from "~/facades/FacadeBase";
import { Material, PurchaseOrder, PurchaseOrderItem, Supplier } from "~/models";
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
      include: [
        {
          model: Supplier,
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
    const record = await PurchaseOrder.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: Supplier,
        },
        {
          model: PurchaseOrderItem,
        },
      ],
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
      include: [
        {
          model: Supplier,
        },
        {
          model: PurchaseOrderItem,
        },
      ],
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

  @WithTransaction
  async sync(id: string, records: PurchaseOrderItemSyncAttributes[]) {
    const purchaseOrder = await this.engine.purchaseOrder.findById(id);
    if (purchaseOrder.status !== "draft") {
      throw new PurchaseOrderInvalidStatusException(
        "draft",
        purchaseOrder.status
      );
    }
    const materialIds = filterDuplicates(
      records.map((record) => record.materialId)
    );
    const foundMaterials = await Material.findAll({
      where: {
        id: {
          [Op.in]: materialIds,
        },
      },
    });
    if (foundMaterials.length !== materialIds.length) {
      const foundMaterialIds = foundMaterials.map((record) => record.id);
      throw new MaterialNotFoundException({
        ids: materialIds.filter(
          (materialId) => !foundMaterialIds.includes(materialId)
        ),
      });
    }
    const inactiveMaterial = foundMaterials.find(
      (record) => record.status !== "active"
    );
    if (inactiveMaterial) {
      throw new MaterialInvalidStatusException(
        "active",
        inactiveMaterial.status
      );
    }

    let total: number = 0;
    for (const record of records) {
      total += record.quantity * record.unitPrice;
    }
    const purchaseOrderItems = await PurchaseOrderItem.findAll({
      where: {
        purchaseOrderId: purchaseOrder.id,
      },
    });
    const compareResult = compareArray(
      purchaseOrderItems,
      records,
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
          purchaseOrderId: purchaseOrder.id,
          materialId,
          quantity,
          remarks,
          unitPrice,
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
        })
      );
    }
    promises.push(
      purchaseOrder.update({
        total,
      })
    );
    await Promise.all(promises);
  }
}
