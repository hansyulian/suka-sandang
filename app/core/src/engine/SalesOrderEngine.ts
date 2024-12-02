import type {
  CreateOmit,
  SalesOrderAttributes,
  SalesOrderCreationAttributes,
  SalesOrderItemAttributes,
  SalesOrderItemSyncAttributes,
  SalesOrderUpdateAttributes,
} from "@app/common";
import {
  compareArray,
  filterDuplicates,
  indexArray,
  sum,
} from "@hyulian/common";
import { Op, type WhereOptions } from "sequelize";
import {
  InventoryInvalidStatusException,
  InventoryNotFoundException,
  SalesOrderDuplicationException,
  SalesOrderInvalidStatusException,
  SalesOrderNotFoundException,
} from "~/exceptions";
import { EngineBase } from "~/engine/EngineBase";
import {
  Inventory,
  SalesOrder,
  SalesOrderItem,
  Customer,
  InventoryFlow,
  SalesOrderItemSequelizeCreationAttributes,
} from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import type { SequelizePaginationOptions } from "~/types";
import { isUuid } from "~/utils/isUuid";
import { InventoryInsufficientQuantityException } from "~/exceptions/InventoryInsufficientQuantityException";

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
      await this.createInventoryFlow(record.id);
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
          await this.createInventoryFlow(id);
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
    const inventoryIds = filterDuplicates(
      records.map((record) => record.inventoryId)
    );
    const foundInventories = await Inventory.findAll({
      where: {
        id: {
          [Op.in]: inventoryIds,
        },
      },
    });
    if (foundInventories.length !== inventoryIds.length) {
      const foundinventoryIds = foundInventories.map((record) => record.id);
      throw new InventoryNotFoundException({
        ids: inventoryIds.filter(
          (inventoryId) => !foundinventoryIds.includes(inventoryId)
        ),
      });
    }
    const inactiveInventory = foundInventories.find(
      (record) => record.status !== "active"
    );
    if (inactiveInventory) {
      throw new InventoryInvalidStatusException(
        "active",
        inactiveInventory.status
      );
    }
    const inventoryIndex = indexArray(foundInventories, "id");
    const requestedInventoryQuantityIndex: Record<string, number> = {};
    for (const record of records) {
      const { inventoryId, quantity } = record;
      requestedInventoryQuantityIndex[inventoryId] =
        requestedInventoryQuantityIndex[inventoryId] || 0;
      requestedInventoryQuantityIndex[inventoryId] += quantity;
    }
    for (const inventoryId in requestedInventoryQuantityIndex) {
      if (
        inventoryIndex[inventoryId].total <
        requestedInventoryQuantityIndex[inventoryId]
      ) {
        throw new InventoryInsufficientQuantityException(
          inventoryIndex[inventoryId],
          requestedInventoryQuantityIndex[inventoryId]
        );
      }
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
    for (const leftOnly of compareResult.leftOnly) {
      await leftOnly.destroy();
    }
    const bulkCreate: CreateOmit<SalesOrderItemAttributes>[] = [];
    for (const rightOnly of compareResult.rightOnly) {
      const { inventoryId, quantity, remarks, unitPrice } = rightOnly;
      bulkCreate.push({
        salesOrderId: record.id,
        inventoryId,
        quantity,
        remarks,
        unitPrice,
        subTotal: quantity * unitPrice,
      });
    }
    for (const itemUpdate of compareResult.both) {
      const { inventoryId, quantity, unitPrice, remarks } = itemUpdate.right;

      await itemUpdate.left.update({
        inventoryId,
        quantity,
        unitPrice,
        remarks,
      });
    }
    await SalesOrderItem.bulkCreate(bulkCreate, { individualHooks: true });
    await this.recalculateTotal(id);
  }

  @WithTransaction
  async createInventoryFlow(id: string) {
    const record = await this.findById(id);
    if (!["processing", "completed"].includes(record.status)) {
      throw new SalesOrderInvalidStatusException("completed", record.status);
    }
    const salesOrderItems = await SalesOrderItem.findAll({
      where: {
        salesOrderId: id,
      },
      include: [
        {
          model: InventoryFlow,
        },
        {
          model: Inventory,
        },
      ],
    });
    for (const salesOrderItem of salesOrderItems) {
      if (
        salesOrderItem.inventoryFlows &&
        salesOrderItem.inventoryFlows.length === 0
      ) {
        await createInventoryFlow(salesOrderItem);
      }
    }
    async function createInventoryFlow(salesOrderItem: SalesOrderItem) {
      const { id, inventoryId, quantity, inventory } = salesOrderItem;
      if (inventory.total < quantity) {
        throw new InventoryInsufficientQuantityException(inventory, quantity);
      }
      await InventoryFlow.create({
        activity: "sales",
        inventoryId,
        quantity: -quantity,
        salesOrderItemId: id,
      });
      await inventory.recalculateTotal();
    }
  }
}
