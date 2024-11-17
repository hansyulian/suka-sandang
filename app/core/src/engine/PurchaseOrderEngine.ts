import type {
  PurchaseOrderAttributes,
  PurchaseOrderCreationAttributes,
  PurchaseOrderItemSyncAttributes,
  PurchaseOrderUpdateAttributes,
} from "@app/common";
import {
  compareArray,
  filterDuplicates,
  generateRandomNumber,
  max,
  sum,
} from "@hyulian/common";
import { Op, type WhereOptions } from "sequelize";
import { MaterialNotFoundException } from "~/exceptions";
import { MaterialInvalidStatusException } from "~/exceptions/MaterialInvalidStatusException";
import { PurchaseOrderDuplicationException } from "~/exceptions/PurchaseOrderDuplicationException";
import { PurchaseOrderInvalidStatusException } from "~/exceptions/PurchaseOrderInvalidStatusException";
import { PurchaseOrderNotFoundException } from "~/exceptions/PurchaseOrderNotFoundException";
import { EngineBase } from "~/engine/EngineBase";
import {
  Inventory,
  InventoryFlow,
  Material,
  PurchaseOrder,
  PurchaseOrderItem,
  Supplier,
} from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import type { SequelizePaginationOptions } from "~/types";
import { uuid } from "~/utils";
import { isUuid } from "~/utils/isUuid";

export class PurchaseOrderEngine extends EngineBase {
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
  async create(
    data: PurchaseOrderCreationAttributes & {
      items?: PurchaseOrderItemSyncAttributes[];
    }
  ) {
    const { code, date, supplierId, remarks, status, items } = data;
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
    if (items) {
      await this.sync(record.id, items);
    }
    return this.findById(record.id);
  }

  @WithTransaction
  async update(
    id: string,
    data: PurchaseOrderUpdateAttributes & {
      items?: PurchaseOrderItemSyncAttributes[];
    }
  ) {
    const { date, remarks, status, items } = data;
    const record = await this.findById(id);
    // validating new status
    switch (record.status) {
      case "draft":
        if (items) {
          await this.sync(id, items);
        }
        await record.update({
          date,
          status,
          remarks,
        });
        if (status === "completed") {
          await this.createInventory(id);
        }
        break;
      case "processing":
        if (status === "draft") {
          throw new PurchaseOrderInvalidStatusException(
            "processing",
            record.status
          );
        }
        await record.update({
          status,
          remarks,
        });
        if (status === "completed") {
          await this.createInventory(id);
        }
        break;
      case "deleted":
      case "cancelled":
      case "completed":
        if (status && status !== record.status) {
          throw new PurchaseOrderInvalidStatusException(status, record.status);
        }
        await record.update({
          remarks,
        });
        break;
    }
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
    const total = sum(
      record.purchaseOrderItems,
      (item) => item.quantity * item.unitPrice
    );
    await record.update({
      total,
    });
  }

  @WithTransaction
  async sync(id: string, records: PurchaseOrderItemSyncAttributes[]) {
    const record = await this.findById(id);
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
    const items = await PurchaseOrderItem.findAll({
      where: {
        purchaseOrderId: record.id,
      },
    });
    const compareResult = compareArray(
      items,
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
          purchaseOrderId: record.id,
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
    await Promise.all(promises);
    await this.recalculateTotal(id);
  }

  @WithTransaction
  async createInventory(id: string) {
    const record = await this.findById(id);
    if (record.status !== "completed") {
      throw new PurchaseOrderInvalidStatusException("completed", record.status);
    }
    const purchaseOrderItems = await PurchaseOrderItem.findAll({
      where: {
        purchaseOrderId: id,
      },
      include: [
        {
          model: InventoryFlow,
        },
      ],
    });
    const promises = [];
    for (const purchaseOrderItem of purchaseOrderItems) {
      if (
        purchaseOrderItem.inventoryFlows &&
        purchaseOrderItem.inventoryFlows.length === 0
      ) {
        promises.push(
          createInventory(
            purchaseOrderItem.id,
            record.code,
            purchaseOrderItem.materialId,
            purchaseOrderItem.quantity
          )
        );
      }
    }

    async function createInventory(
      purchaseOrderItemId: string,
      purchaseOrderCode: string,
      materialId: string,
      quantity: number
    ) {
      const id = uuid();
      const randomNumber = generateRandomNumber(
        0,
        purchaseOrderItems.length * 100
      );
      const code = `inv-${purchaseOrderCode}-${randomNumber}`;
      await Inventory.create({
        id,
        code,
        materialId,
        remarks: "",
        total: quantity,
      }),
        await InventoryFlow.create({
          activity: "procurement",
          inventoryId: id,
          quantity,
          purchaseOrderItemId,
          remarks: "",
        });
    }

    await Promise.all(promises);
  }
}
