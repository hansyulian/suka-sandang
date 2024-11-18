import type {
  SalesOrderAttributes,
  SalesOrderCreationAttributes,
  SalesOrderItemSyncAttributes,
  SalesOrderUpdateAttributes,
} from "@app/common";
import {
  compareArray,
  filterDuplicates,
  generateRandomNumber,
  max,
  sum,
} from "@hyulian/common";
import { Op, type WhereOptions } from "sequelize";
import {
  MaterialNotFoundException,
  SalesOrderDuplicationException,
  SalesOrderInvalidStatusException,
  SalesOrderNotFoundException,
} from "~/exceptions";
import { MaterialInvalidStatusException } from "~/exceptions/MaterialInvalidStatusException";
import { EngineBase } from "~/engine/EngineBase";
import {
  Inventory,
  InventoryFlow,
  Material,
  SalesOrder,
  SalesOrderItem,
  Customer,
} from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import type { SequelizePaginationOptions } from "~/types";
import { uuid } from "~/utils";
import { isUuid } from "~/utils/isUuid";

export class SalesOrderEngine extends EngineBase {
  @WithTransaction
  async list(
    query: WhereOptions<SalesOrderAttributes>,
    options: SequelizePaginationOptions
  ) {
    const result = await SalesOrder.findAndCountAll({
      where: {
        ...query,
      },
      ...options,
      include: [
        {
          model: Customer,
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
    const record = await SalesOrder.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: Customer,
        },
        {
          model: SalesOrderItem,
        },
      ],
    });
    if (!record) {
      throw new SalesOrderNotFoundException({ id });
    }
    return record;
  }

  @WithTransaction
  async findByIdOrCode(idOrCode: string) {
    const where: WhereOptions<SalesOrderAttributes> = isUuid(idOrCode)
      ? { id: idOrCode }
      : { code: idOrCode };
    const result = await SalesOrder.findOne({
      where,
      paranoid: false,
      include: [
        {
          model: Customer,
        },
        {
          model: SalesOrderItem,
        },
      ],
    });
    if (!result) {
      throw new SalesOrderNotFoundException({ idOrCode });
    }
    return result;
  }

  @WithTransaction
  async create(
    data: SalesOrderCreationAttributes & {
      items?: SalesOrderItemSyncAttributes[];
    }
  ) {
    const { code, date, customerId, remarks, status, items } = data;
    const recordByCode = await SalesOrder.findOne({
      where: { code },
      paranoid: true,
    });
    if (recordByCode) {
      throw new SalesOrderDuplicationException({ code });
    }
    const record = await SalesOrder.create({
      code,
      date,
      customerId,
      status,
      remarks,
    });
    if (items) {
      await this.sync(record.id, items);
    }
    if (status && ["processing", "completed"].includes(status)) {
      await this.createInventory(record.id);
    }
    return this.findById(record.id);
  }

  @WithTransaction
  async update(
    id: string,
    data: SalesOrderUpdateAttributes & {
      items?: SalesOrderItemSyncAttributes[];
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
        if (status && ["completed", "processing"].includes(status)) {
          await this.createInventory(id);
        }
        break;
      case "processing":
        if (status === "draft") {
          throw new SalesOrderInvalidStatusException(
            "processing",
            record.status
          );
        }
        await record.update({
          status,
          remarks,
        });
        break;
      case "deleted":
      case "cancelled":
      case "completed":
        if (status && status !== record.status) {
          throw new SalesOrderInvalidStatusException(status, record.status);
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
      throw new SalesOrderInvalidStatusException("draft", record.status);
    }
    await record.destroy();
  }

  @WithTransaction
  async recalculateTotal(id: string) {
    const record = await this.findById(id);
    const total = sum(
      record.salesOrderItems,
      (item) => item.quantity * item.unitPrice
    );
    await record.update({
      total,
    });
  }

  @WithTransaction
  async sync(id: string, records: SalesOrderItemSyncAttributes[]) {
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
    const items = await SalesOrderItem.findAll({
      where: {
        salesOrderId: record.id,
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
        SalesOrderItem.create({
          salesOrderId: record.id,
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
    if (!["completed", "processing"].includes(record.status)) {
      throw new SalesOrderInvalidStatusException("processing", record.status);
    }
    const salesOrderItems = await SalesOrderItem.findAll({
      where: {
        salesOrderId: id,
      },
      include: [
        {
          model: InventoryFlow,
        },
      ],
    });
    const promises = [];
    for (const salesOrderItem of salesOrderItems) {
      if (
        salesOrderItem.inventoryFlows &&
        salesOrderItem.inventoryFlows.length === 0
      ) {
        promises.push(
          createInventory(
            salesOrderItem.id,
            record.code,
            salesOrderItem.materialId,
            salesOrderItem.quantity
          )
        );
      }
    }

    async function createInventory(
      salesOrderItemId: string,
      salesOrderCode: string,
      materialId: string,
      quantity: number
    ) {
      const id = uuid();
      const randomNumber = generateRandomNumber(
        0,
        salesOrderItems.length * 100
      );
      const code = `inv-${salesOrderCode}-${randomNumber}`;
      await Inventory.create({
        id,
        code,
        materialId,
        remarks: "",
        total: quantity,
      }),
        await InventoryFlow.create({
          activity: "sales",
          inventoryId: id,
          quantity: -quantity,
          salesOrderItemId,
          remarks: "",
        });
    }

    await Promise.all(promises);
  }
}
