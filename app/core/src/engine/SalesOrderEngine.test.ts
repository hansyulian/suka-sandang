import { Engine } from "~/CoreEngine";

import { idGenerator } from "~test/utils/idGenerator";
import { salesOrderFixtures } from "~test/fixtures/salesOrderFixtures";
import { resetData } from "~test/utils/resetData";
import { SalesOrderDuplicationException } from "~/exceptions/SalesOrderDuplicationException";
import { SalesOrderInvalidStatusException } from "~/exceptions/SalesOrderInvalidStatusException";
import { SalesOrderNotFoundException } from "~/exceptions/SalesOrderNotFoundException";
import { materialFixtures } from "~test/fixtures/materialFixtures";
import { customerFixtures } from "~test/fixtures/customerFixtures";
import {
  SalesOrderCreationAttributes,
  SalesOrderItemSyncAttributes,
  SalesOrderUpdateAttributes,
} from "@app/common";
import { Inventory, InventoryFlow, SalesOrder, SalesOrderItem } from "~/models";
import { InventoryNotFoundException } from "~/exceptions";
import { inventoryFixtures } from "~test/fixtures/inventoryFixtures";
import { InventoryInsufficientQuantityException } from "~/exceptions/InventoryInsufficientQuantityException";

describe("SalesOrderEngine", () => {
  const engine = new Engine();
  const draftSalesOrderId = idGenerator.salesOrder(0);
  const completedSalesOrderId = idGenerator.salesOrder(1);

  beforeAll(async () => {
    await resetData();
    await materialFixtures();
    await customerFixtures();
  });

  describe("list", () => {
    beforeAll(async () => {
      await resetData([Inventory, SalesOrderItem, SalesOrder]);
      await inventoryFixtures();
      await salesOrderFixtures();
    });
    it("should return a list of sales orders", async () => {
      const result = await engine.salesOrder.list({}, { limit: 10, offset: 0 });
      expect(result.count).toStrictEqual(50);
      expect(result.records).toHaveLength(10);
      expect(result.records[0].customer).toBeDefined();
      expect(result.records[0].salesOrderItems).toBeUndefined();
    });
    it("should return a list of sales orders with status filter", async () => {
      const result = await engine.salesOrder.list(
        { status: "draft" },
        { limit: 10, offset: 0 }
      );
      expect(result.count).toStrictEqual(13);
      expect(result.records).toHaveLength(10);
      for (const record of result.records) {
        expect(record.status).toStrictEqual("draft");
        expect(record.customer).toBeDefined();
        expect(record.salesOrderItems).toBeUndefined();
      }
    });
  });

  describe("findById", () => {
    beforeAll(async () => {
      await resetData([Inventory, SalesOrderItem, SalesOrder]);
      await inventoryFixtures();
      await salesOrderFixtures();
    });
    it("should return a sales order by id", async () => {
      const result = await engine.salesOrder.findById(draftSalesOrderId);
      expect(result).toBeDefined();
      expect(result.id).toStrictEqual(draftSalesOrderId);
      expect(result.customer).toBeDefined();
      expect(result.salesOrderItems).toHaveLength(5);
    });

    it("should throw SalesOrderNotFoundException for non-existent id", async () => {
      const nonExistentId = idGenerator.salesOrder(999);
      await expect(engine.salesOrder.findById(nonExistentId)).rejects.toThrow(
        SalesOrderNotFoundException
      );
    });
  });
  describe("findByIdOrCode", () => {
    beforeAll(async () => {
      await resetData([Inventory, SalesOrderItem, SalesOrder]);
      await inventoryFixtures();
      await salesOrderFixtures();
    });
    it("should return a sales order by id", async () => {
      const result = await engine.salesOrder.findByIdOrCode(draftSalesOrderId);
      expect(result).toBeDefined();
      expect(result.id).toStrictEqual(draftSalesOrderId);
      expect(result.customer).toBeDefined();
      expect(result.salesOrderItems).toHaveLength(5);
    });
    it("should return a sales order by code", async () => {
      const result = await engine.salesOrder.findByIdOrCode("PO-0");
      expect(result).toBeDefined();
      expect(result.id).toStrictEqual(draftSalesOrderId);
      expect(result.customer).toBeDefined();
      expect(result.salesOrderItems).toHaveLength(5);
    });

    it("should throw SalesOrderNotFoundException for non-existent id", async () => {
      const nonExistentId = idGenerator.salesOrder(999);
      await expect(engine.salesOrder.findById(nonExistentId)).rejects.toThrow(
        SalesOrderNotFoundException
      );
    });
  });

  describe("create", () => {
    let syncMock: jest.SpyInstance;
    let createInventoryFlowMock: jest.SpyInstance;
    beforeAll(() => {
      syncMock = jest
        .spyOn(engine.salesOrder, "sync")
        .mockImplementation(() => Promise.resolve());
      createInventoryFlowMock = jest
        .spyOn(engine.salesOrder, "createInventoryFlow")
        .mockImplementation(() => Promise.resolve());
    });
    beforeEach(async () => {
      syncMock.mockClear();
      createInventoryFlowMock.mockClear();
      await resetData([Inventory, SalesOrderItem, SalesOrder]);
      await inventoryFixtures();
      await salesOrderFixtures();
    });
    afterAll(() => {
      syncMock.mockRestore();
      createInventoryFlowMock.mockRestore();
    });
    it("should create a new sales order", async () => {
      const data: SalesOrderCreationAttributes = {
        code: "PO-100",
        date: new Date(),
        customerId: idGenerator.customer(0),
        remarks: "Test Sales Order",
        status: "draft",
      };
      const result = await engine.salesOrder.create(data);
      expect(result).toBeDefined();
      expect(result.code).toBe(data.code);
      expect(result.total).toBe(0);
      expect(syncMock).toHaveBeenCalledTimes(0);
      expect(createInventoryFlowMock).toHaveBeenCalledTimes(0);
    });
    it("should create a new sales order and call sync if items are defined", async () => {
      const code = "PO-100";
      const result = await engine.salesOrder.create({
        code,
        date: new Date(),
        customerId: idGenerator.customer(0),
        remarks: "Test Sales Order",
        status: "draft",
        items: [],
      });
      expect(result).toBeDefined();
      expect(result.code).toBe(code);
      expect(result.total).toBe(0);
      expect(syncMock).toHaveBeenCalledTimes(1);
      expect(syncMock).toHaveBeenCalledWith(result.id, []);
      expect(createInventoryFlowMock).toHaveBeenCalledTimes(0);
    });

    it("should create a new sales order and call createInventory if status is processing and above", async () => {
      const code = "PO-100";
      const result = await engine.salesOrder.create({
        code,
        date: new Date(),
        customerId: idGenerator.customer(0),
        remarks: "Test Sales Order",
        status: "processing",
        items: [],
      });
      expect(result).toBeDefined();
      expect(result.code).toBe(code);
      expect(result.total).toBe(0);
      expect(createInventoryFlowMock).toHaveBeenCalledTimes(1);
      expect(createInventoryFlowMock).toHaveBeenCalledWith(result.id);
    });

    it("should throw SalesOrderDuplicationException for duplicate code", async () => {
      const data: SalesOrderCreationAttributes = {
        code: "PO-0",
        date: new Date(),
        customerId: idGenerator.customer(0),
        remarks: "Duplicate Test Sales Order",
        status: "draft",
      };
      await expect(engine.salesOrder.create(data)).rejects.toThrow(
        SalesOrderDuplicationException
      );
    });
  });

  describe("update", () => {
    let syncMock: jest.SpyInstance;
    let createInventoryFlowMock: jest.SpyInstance;
    beforeAll(() => {
      syncMock = jest
        .spyOn(engine.salesOrder, "sync")
        .mockImplementation(() => Promise.resolve());
      createInventoryFlowMock = jest
        .spyOn(engine.salesOrder, "createInventoryFlow")
        .mockImplementation(() => Promise.resolve());
    });

    beforeEach(async () => {
      syncMock.mockClear();
      createInventoryFlowMock.mockClear();
      await resetData([Inventory, SalesOrderItem, SalesOrder]);
      await inventoryFixtures();
      await salesOrderFixtures();
    });
    afterAll(() => {
      syncMock.mockRestore();
      createInventoryFlowMock.mockRestore();
    });
    it("should update an existing sales order", async () => {
      const id = idGenerator.salesOrder(0);
      const data = {
        date: new Date(),
        remarks: "Updated remarks",
        status: "draft",
        code: "updated code",
        total: 1234,
        customerId: idGenerator.customer(50),
      }; // add extra to check if other properties get updated or not
      const result = await engine.salesOrder.update(id, data as any);
      expect(result).toBeDefined();
      expect(result.remarks).toBe(data.remarks);
      expect(result.code).toStrictEqual("PO-0");
      expect(result.customerId).toStrictEqual(idGenerator.customer(0));
      expect(result.total).toStrictEqual(0);
      expect(syncMock).toHaveBeenCalledTimes(0);
      expect(createInventoryFlowMock).toHaveBeenCalledTimes(0);
    });
    it("should update an existing sales order and call sync if items are defined", async () => {
      const id = idGenerator.salesOrder(0);
      const data = {
        date: new Date(),
        remarks: "Updated remarks",
        status: "draft",
        code: "updated code",
        total: 1234,
        customerId: idGenerator.customer(50),
        items: [],
      }; // add extra to check if other properties get updated or not
      const result = await engine.salesOrder.update(id, data as any);
      expect(result).toBeDefined();
      expect(result.remarks).toBe(data.remarks);
      expect(result.code).toStrictEqual("PO-0");
      expect(result.customerId).toStrictEqual(idGenerator.customer(0));
      expect(result.total).toStrictEqual(0);
      expect(syncMock).toHaveBeenCalledTimes(1);
      expect(syncMock).toHaveBeenCalledWith(id, []);
      expect(createInventoryFlowMock).toHaveBeenCalledTimes(0);
    });
    it("should update an existing sales order and call createInventory if become processing", async () => {
      const id = idGenerator.salesOrder(0);
      const data = {
        date: new Date(),
        remarks: "Updated remarks",
        status: "processing",
        code: "updated code",
        total: 1234,
        customerId: idGenerator.customer(50),
        items: [],
      }; // add extra to check if other properties get updated or not
      const result = await engine.salesOrder.update(id, data as any);
      expect(result).toBeDefined();
      expect(result.remarks).toBe(data.remarks);
      expect(result.code).toStrictEqual("PO-0");
      expect(result.customerId).toStrictEqual(idGenerator.customer(0));
      expect(result.total).toStrictEqual(0);
      expect(syncMock).toHaveBeenCalledTimes(1);
      expect(syncMock).toHaveBeenCalledWith(id, []);
      expect(createInventoryFlowMock).toHaveBeenCalledTimes(1);
      expect(createInventoryFlowMock).toHaveBeenCalledWith(id);
    });

    it("should only able to update remarks and status to completed on processing sales order", async () => {
      const id = idGenerator.salesOrder(2);
      const originalSalesOrder = await engine.salesOrder.findById(id);
      const data: SalesOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a completed order",
        status: "completed",
      };
      await engine.salesOrder.update(id, data);
      const updatedRecord = await engine.salesOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalSalesOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(data.status);
    });

    it("should only able to update remarks on completed sales order", async () => {
      const id = idGenerator.salesOrder(1);
      const originalSalesOrder = await engine.salesOrder.findById(id);
      const data: SalesOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a completed order",
        status: "completed",
      };
      await engine.salesOrder.update(id, data);
      const updatedRecord = await engine.salesOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalSalesOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(originalSalesOrder.status);
    });
    it("should only able to update remarks on processing sales order", async () => {
      const id = idGenerator.salesOrder(2);
      const originalSalesOrder = await engine.salesOrder.findById(id);
      const data: SalesOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a processing order",
        status: "processing",
      };
      await engine.salesOrder.update(id, data);
      const updatedRecord = await engine.salesOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalSalesOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(originalSalesOrder.status);
    });
    it("should only able to update remarks on cancelled sales order", async () => {
      const id = idGenerator.salesOrder(3);
      const originalSalesOrder = await engine.salesOrder.findById(id);
      const data: SalesOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a cancelled order",
        status: "cancelled",
      };
      await engine.salesOrder.update(id, data);
      const updatedRecord = await engine.salesOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalSalesOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(originalSalesOrder.status);
    });
    it("should only able to update remarks on deleted sales order", async () => {
      const id = idGenerator.salesOrder(50);
      const originalSalesOrder = await engine.salesOrder.findById(id);
      const data: SalesOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a deleted order",
        status: "deleted",
      };
      await engine.salesOrder.update(id, data);
      const updatedRecord = await engine.salesOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalSalesOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(originalSalesOrder.status);
    });

    it("should throw SalesOrderInvalidStatusException when updating status on completed sales order", async () => {
      const id = idGenerator.salesOrder(1);

      const data: SalesOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a completed order",
        status: "draft",
      };
      await expect(engine.salesOrder.update(id, data)).rejects.toThrow(
        SalesOrderInvalidStatusException
      );
    });
    it("should throw SalesOrderInvalidStatusException when updating status on processing sales order", async () => {
      const id = idGenerator.salesOrder(2);

      const data: SalesOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a processing order",
        status: "draft",
      };
      await expect(engine.salesOrder.update(id, data)).rejects.toThrow(
        SalesOrderInvalidStatusException
      );
    });
    it("should throw SalesOrderInvalidStatusException when updating status on cancelled sales order", async () => {
      const id = idGenerator.salesOrder(3);

      const data: SalesOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a cancelled order",
        status: "draft",
      };
      await expect(engine.salesOrder.update(id, data)).rejects.toThrow(
        SalesOrderInvalidStatusException
      );
    });
    it("should throw SalesOrderInvalidStatusException when updating status on deleted sales order", async () => {
      const id = idGenerator.salesOrder(50);

      const data: SalesOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a deleted order",
        status: "draft",
      };
      await expect(engine.salesOrder.update(id, data)).rejects.toThrow(
        SalesOrderInvalidStatusException
      );
    });
    it("should throw SalesOrderNotFound for non-existent order", async () => {
      const id = idGenerator.salesOrder(199);
      const data: SalesOrderUpdateAttributes = {
        remarks: "Trying to update a completed order",
        status: "completed",
      };
      await expect(engine.salesOrder.update(id, data)).rejects.toThrow(
        SalesOrderNotFoundException
      );
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await resetData([Inventory, SalesOrderItem, SalesOrder]);
      await inventoryFixtures();
      await salesOrderFixtures();
    });
    it("should delete a sales order", async () => {
      const result = await engine.salesOrder.delete(draftSalesOrderId);
      const record = await SalesOrder.findByPk(draftSalesOrderId, {
        paranoid: false,
      });
      expect(record).toBeDefined();
      expect(record?.status).toStrictEqual("deleted");
    });

    it("should throw SalesOrderInvalidStatusException for non-pending order", async () => {
      await expect(
        engine.salesOrder.delete(idGenerator.salesOrder(1))
      ).rejects.toThrow(SalesOrderInvalidStatusException);
    });
    it("should throw SalesOrderNotFound for non-existent order", async () => {
      const id = idGenerator.salesOrder(199);
      await expect(engine.salesOrder.delete(id)).rejects.toThrow(
        SalesOrderNotFoundException
      );
    });
  });

  describe("sync", () => {
    beforeEach(async () => {
      await resetData([Inventory, SalesOrderItem, SalesOrder]);
      await inventoryFixtures();
      await salesOrderFixtures();
    });

    it("should add new items and update total correctly", async () => {
      const newItems: SalesOrderItemSyncAttributes[] = [
        {
          inventoryId: idGenerator.inventory(1),
          quantity: 10,
          unitPrice: 100,
          remarks: "New Item 1",
        },
        {
          inventoryId: idGenerator.inventory(2),
          quantity: 5,
          unitPrice: 200,
          remarks: "New Item 2",
        },
      ];

      await engine.salesOrder.sync(draftSalesOrderId, newItems);

      const updatedOrder = await SalesOrder.findByPk(draftSalesOrderId, {
        include: [SalesOrderItem],
      });
      expect(updatedOrder?.total).toBe(2000);
      expect(updatedOrder?.salesOrderItems).toHaveLength(2);

      const itemIds =
        updatedOrder?.salesOrderItems.map((item) => item.inventoryId) || [];
      expect(itemIds[0]).toStrictEqual(idGenerator.inventory(1));
      expect(itemIds[1]).toStrictEqual(idGenerator.inventory(2));
    });

    it("should update existing items without duplication", async () => {
      const existingItems: SalesOrderItemSyncAttributes[] = [
        {
          id: idGenerator.salesOrderItem(0, 0),
          inventoryId: idGenerator.inventory(1),
          quantity: 10,
          unitPrice: 150,
          remarks: "Updated Item",
        },
      ];

      await engine.salesOrder.sync(draftSalesOrderId, existingItems);

      const updatedOrder = await SalesOrder.findByPk(draftSalesOrderId, {
        include: [SalesOrderItem],
      });
      expect(updatedOrder?.salesOrderItems).toHaveLength(1);
      expect(updatedOrder?.salesOrderItems[0].quantity).toBe(10);
      expect(updatedOrder?.salesOrderItems[0].unitPrice).toBe(150);
    });
    it("should throw insufficient inventory if trying to update beyond current inventory availability", async () => {
      const existingItems: SalesOrderItemSyncAttributes[] = [
        {
          id: idGenerator.salesOrderItem(0, 0),
          inventoryId: idGenerator.inventory(1),
          quantity: 20,
          unitPrice: 150,
          remarks: "Updated Item",
        },
      ];

      await expect(
        engine.salesOrder.sync(draftSalesOrderId, existingItems)
      ).rejects.toThrow(InventoryInsufficientQuantityException);
      const updatedOrder = await SalesOrder.findByPk(draftSalesOrderId, {
        include: [SalesOrderItem],
      });
      expect(updatedOrder?.salesOrderItems.length).toStrictEqual(5);
    });

    it("should throw InventoryNotFoundException if any item has an invalid inventory ID", async () => {
      const invalidItems: SalesOrderItemSyncAttributes[] = [
        {
          inventoryId: "000000000000-0000-0000-000000000000",
          quantity: 5,
          unitPrice: 100,
          remarks: "Invalid Item",
        },
      ];
      await expect(
        engine.salesOrder.sync(draftSalesOrderId, invalidItems)
      ).rejects.toThrow(InventoryNotFoundException);
    });
  });

  describe("recalculateTotal", () => {
    beforeEach(async () => {
      await resetData([Inventory, SalesOrderItem, SalesOrder]);
      await inventoryFixtures();
      await salesOrderFixtures();
    });
    it("should correctly calculate and update the total of a sales order", async () => {
      const id = draftSalesOrderId;
      await engine.salesOrder.recalculateTotal(id);
      const updatedOrder = await SalesOrder.findByPk(id);

      expect(updatedOrder?.total).toStrictEqual(2500);
    });
  });

  describe("createInventory", () => {
    beforeEach(async () => {
      await resetData([Inventory, SalesOrderItem, SalesOrder]);
      await inventoryFixtures();
      await salesOrderFixtures();
    });

    it("should create inventory and inventory flows when the sales order is completed", async () => {
      await engine.salesOrder.createInventoryFlow(completedSalesOrderId);
      const salesOrderItems = await SalesOrderItem.findAll({
        where: {
          salesOrderId: completedSalesOrderId,
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

      expect(salesOrderItems).toHaveLength(5); // Assuming each item generates one inventory flow
      for (const salesOrderItem of salesOrderItems) {
        expect(salesOrderItem.inventoryFlows).toHaveLength(1);
        expect(salesOrderItem.inventoryFlows[0].activity).toBe("sales");
      }
    });

    it("should throw SalesOrderInvalidStatusException if the sales order status is not completed", async () => {
      const id = draftSalesOrderId;
      await expect(engine.salesOrder.createInventoryFlow(id)).rejects.toThrow(
        SalesOrderInvalidStatusException
      );
    });
  });
});
