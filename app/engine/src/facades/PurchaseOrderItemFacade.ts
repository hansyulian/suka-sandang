import type {
  PurchaseOrderItemAttributes,
  PurchaseOrderItemCreationAttributes,
  PurchaseOrderItemUpdateAttributes,
} from "@app/common";
import { compareArray, filterDuplicates } from "@hyulian/common";
import { Op } from "sequelize";
import type { WhereOptions } from "sequelize";
import { MaterialNotFoundException } from "~/exceptions";
import { MaterialInvalidStatusException } from "~/exceptions/MaterialInvalidStatusException";
import { PurchaseOrderInvalidStatusException } from "~/exceptions/PurchaseOrderInvalidStatusException";
import { PurchaseOrderItemNotFoundException } from "~/exceptions/PurchaseOrderItemNotFoundException";
import { FacadeBase } from "~/facades/FacadeBase";
import { Material, PurchaseOrder, PurchaseOrderItem } from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import type { SequelizePaginationOptions } from "~/types";

export type PurchaseOrderItemSyncAttributes =
  | Omit<PurchaseOrderItemAttributes, "purchaseOrderId">
  | Omit<PurchaseOrderItemCreationAttributes, "purchaseOrderId">;
// item attributes = for update
// creation attributes = for add

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
    const compareResult = compareArray(
      purchaseOrder.purchaseOrderItems,
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
