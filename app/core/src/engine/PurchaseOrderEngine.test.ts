import { Engine } from "~/CoreEngine";

import { idGenerator } from "~test/utils/idGenerator";
import { purchaseOrderFixtures } from "~test/fixtures/purchaseOrderFixtures";
import { resetData } from "~test/utils/resetData";
import { PurchaseOrderDuplicationException } from "~/exceptions/PurchaseOrderDuplicationException";
import { PurchaseOrderInvalidStatusException } from "~/exceptions/PurchaseOrderInvalidStatusException";
import { PurchaseOrderNotFoundException } from "~/exceptions/PurchaseOrderNotFoundException";
import { materialFixtures } from "~test/fixtures/materialFixtures";
import { supplierFixtures } from "~test/fixtures/supplierFixtures";
import {
  PurchaseOrderCreationAttributes,
  PurchaseOrderItemSyncAttributes,
  PurchaseOrderUpdateAttributes,
} from "@app/common";
import {
  Inventory,
  InventoryFlow,
  PurchaseOrder,
  PurchaseOrderItem,
} from "~/models";
import { MaterialNotFoundException } from "~/exceptions";

describe("PurchaseOrderEngine", () => {
  const engine = new Engine();
  const draftPurchaseOrderId = idGenerator.purchaseOrder(0);
  const completedPurchaseOrderId = idGenerator.purchaseOrder(1);

  beforeAll(async () => {
    await resetData();
    await materialFixtures();
    await supplierFixtures();
  });

  describe("list", () => {
    beforeAll(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    it("should return a list of purchase orders", async () => {
      const result = await engine.purchaseOrder.list(
        {},
        { limit: 10, offset: 0 }
      );
      expect(result.count).toStrictEqual(50);
      expect(result.records).toHaveLength(10);
      expect(result.records[0].supplier).toBeDefined();
      expect(result.records[0].purchaseOrderItems).toBeUndefined();
    });
    it("should return a list of purchase orders with status filter", async () => {
      const result = await engine.purchaseOrder.list(
        { status: "draft" },
        { limit: 10, offset: 0 }
      );
      expect(result.count).toStrictEqual(13);
      expect(result.records).toHaveLength(10);
      for (const record of result.records) {
        expect(record.status).toStrictEqual("draft");
        expect(record.supplier).toBeDefined();
        expect(record.purchaseOrderItems).toBeUndefined();
      }
    });
  });

  describe("findById", () => {
    beforeAll(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    it("should return a purchase order by id", async () => {
      const result = await engine.purchaseOrder.findById(draftPurchaseOrderId);
      expect(result).toBeDefined();
      expect(result.id).toStrictEqual(draftPurchaseOrderId);
      expect(result.supplier).toBeDefined();
      expect(result.purchaseOrderItems).toHaveLength(5);
    });

    it("should throw PurchaseOrderNotFoundException for non-existent id", async () => {
      const nonExistentId = idGenerator.purchaseOrder(999);
      await expect(
        engine.purchaseOrder.findById(nonExistentId)
      ).rejects.toThrow(PurchaseOrderNotFoundException);
    });
  });
  describe("findByIdOrCode", () => {
    beforeAll(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    it("should return a purchase order by id", async () => {
      const result = await engine.purchaseOrder.findByIdOrCode(
        draftPurchaseOrderId
      );
      expect(result).toBeDefined();
      expect(result.id).toStrictEqual(draftPurchaseOrderId);
      expect(result.supplier).toBeDefined();
      expect(result.purchaseOrderItems).toHaveLength(5);
    });
    it("should return a purchase order by code", async () => {
      const result = await engine.purchaseOrder.findByIdOrCode("PO-0");
      expect(result).toBeDefined();
      expect(result.id).toStrictEqual(draftPurchaseOrderId);
      expect(result.supplier).toBeDefined();
      expect(result.purchaseOrderItems).toHaveLength(5);
    });

    it("should throw PurchaseOrderNotFoundException for non-existent id", async () => {
      const nonExistentId = idGenerator.purchaseOrder(999);
      await expect(
        engine.purchaseOrder.findById(nonExistentId)
      ).rejects.toThrow(PurchaseOrderNotFoundException);
    });
  });

  describe("create", () => {
    let syncMock: jest.SpyInstance;
    let createInventoryMock: jest.SpyInstance;
    beforeAll(() => {
      syncMock = jest
        .spyOn(engine.purchaseOrder, "sync")
        .mockImplementation(() => Promise.resolve());
      createInventoryMock = jest
        .spyOn(engine.purchaseOrder, "createInventory")
        .mockImplementation(() => Promise.resolve());
    });
    beforeEach(async () => {
      syncMock.mockClear();
      createInventoryMock.mockClear();
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    afterAll(() => {
      syncMock.mockRestore();
      createInventoryMock.mockRestore();
    });
    it("should create a new purchase order", async () => {
      const data: PurchaseOrderCreationAttributes = {
        code: "PO-100",
        date: new Date(),
        supplierId: idGenerator.supplier(0),
        remarks: "Test Purchase Order",
        status: "draft",
      };
      const result = await engine.purchaseOrder.create(data);
      expect(result).toBeDefined();
      expect(result.code).toBe(data.code);
      expect(result.total).toBe(0);
      expect(syncMock).toHaveBeenCalledTimes(0);
      expect(createInventoryMock).toHaveBeenCalledTimes(0);
    });
    it("should create a new purchase order and call sync if items are defined", async () => {
      const code = "PO-100";
      const result = await engine.purchaseOrder.create({
        code,
        date: new Date(),
        supplierId: idGenerator.supplier(0),
        remarks: "Test Purchase Order",
        status: "draft",
        items: [],
      });
      expect(result).toBeDefined();
      expect(result.code).toBe(code);
      expect(result.total).toBe(0);
      expect(syncMock).toHaveBeenCalledTimes(1);
      expect(syncMock).toHaveBeenCalledWith(result.id, []);
      expect(createInventoryMock).toHaveBeenCalledTimes(0);
    });

    it("should create a new purchase order and call createInventory if status is completed and above", async () => {
      const code = "PO-100";
      const result = await engine.purchaseOrder.create({
        code,
        date: new Date(),
        supplierId: idGenerator.supplier(0),
        remarks: "Test Purchase Order",
        status: "completed",
        items: [],
      });
      expect(result).toBeDefined();
      expect(result.code).toBe(code);
      expect(result.total).toBe(0);
      expect(createInventoryMock).toHaveBeenCalledTimes(1);
      expect(createInventoryMock).toHaveBeenCalledWith(result.id);
    });

    it("should throw PurchaseOrderDuplicationException for duplicate code", async () => {
      const data: PurchaseOrderCreationAttributes = {
        code: "PO-0",
        date: new Date(),
        supplierId: idGenerator.supplier(0),
        remarks: "Duplicate Test Purchase Order",
        status: "draft",
      };
      await expect(engine.purchaseOrder.create(data)).rejects.toThrow(
        PurchaseOrderDuplicationException
      );
    });
  });

  describe("update", () => {
    let syncMock: jest.SpyInstance;
    let createInventoryMock: jest.SpyInstance;
    beforeAll(() => {
      syncMock = jest
        .spyOn(engine.purchaseOrder, "sync")
        .mockImplementation(() => Promise.resolve());
      createInventoryMock = jest
        .spyOn(engine.purchaseOrder, "createInventory")
        .mockImplementation(() => Promise.resolve());
    });

    beforeEach(async () => {
      syncMock.mockClear();
      createInventoryMock.mockClear();
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    afterAll(() => {
      syncMock.mockRestore();
      createInventoryMock.mockRestore();
    });
    it("should update an existing purchase order", async () => {
      const id = idGenerator.purchaseOrder(0);
      const data = {
        date: new Date(),
        remarks: "Updated remarks",
        status: "draft",
        code: "updated code",
        total: 1234,
        supplierId: idGenerator.supplier(50),
      }; // add extra to check if other properties get updated or not
      const result = await engine.purchaseOrder.update(id, data as any);
      expect(result).toBeDefined();
      expect(result.remarks).toBe(data.remarks);
      expect(result.code).toStrictEqual("PO-0");
      expect(result.supplierId).toStrictEqual(idGenerator.supplier(0));
      expect(result.total).toStrictEqual(0);
      expect(syncMock).toHaveBeenCalledTimes(0);
      expect(createInventoryMock).toHaveBeenCalledTimes(0);
    });
    it("should update an existing purchase order and call sync if items are defined", async () => {
      const id = idGenerator.purchaseOrder(0);
      const data = {
        date: new Date(),
        remarks: "Updated remarks",
        status: "draft",
        code: "updated code",
        total: 1234,
        supplierId: idGenerator.supplier(50),
        items: [],
      }; // add extra to check if other properties get updated or not
      const result = await engine.purchaseOrder.update(id, data as any);
      expect(result).toBeDefined();
      expect(result.remarks).toBe(data.remarks);
      expect(result.code).toStrictEqual("PO-0");
      expect(result.supplierId).toStrictEqual(idGenerator.supplier(0));
      expect(result.total).toStrictEqual(0);
      expect(syncMock).toHaveBeenCalledTimes(1);
      expect(syncMock).toHaveBeenCalledWith(id, []);
      expect(createInventoryMock).toHaveBeenCalledTimes(0);
    });
    it("should update an existing purchase order and call createInventory if become completed", async () => {
      const id = idGenerator.purchaseOrder(0);
      const data = {
        date: new Date(),
        remarks: "Updated remarks",
        status: "completed",
        code: "updated code",
        total: 1234,
        supplierId: idGenerator.supplier(50),
        items: [],
      }; // add extra to check if other properties get updated or not
      const result = await engine.purchaseOrder.update(id, data as any);
      expect(result).toBeDefined();
      expect(result.remarks).toBe(data.remarks);
      expect(result.code).toStrictEqual("PO-0");
      expect(result.supplierId).toStrictEqual(idGenerator.supplier(0));
      expect(result.total).toStrictEqual(0);
      expect(syncMock).toHaveBeenCalledTimes(1);
      expect(syncMock).toHaveBeenCalledWith(id, []);
      expect(createInventoryMock).toHaveBeenCalledTimes(1);
      expect(createInventoryMock).toHaveBeenCalledWith(id);
    });

    it("should only able to update remarks and status to completed on processing purchase order", async () => {
      const id = idGenerator.purchaseOrder(2);
      const originalPurchaseOrder = await engine.purchaseOrder.findById(id);
      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a completed order",
        status: "completed",
      };
      await engine.purchaseOrder.update(id, data);
      const updatedRecord = await engine.purchaseOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalPurchaseOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(data.status);
    });

    it("should only able to update remarks on completed purchase order", async () => {
      const id = idGenerator.purchaseOrder(1);
      const originalPurchaseOrder = await engine.purchaseOrder.findById(id);
      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a completed order",
        status: "completed",
      };
      await engine.purchaseOrder.update(id, data);
      const updatedRecord = await engine.purchaseOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalPurchaseOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(originalPurchaseOrder.status);
    });
    it("should only able to update remarks on processing purchase order", async () => {
      const id = idGenerator.purchaseOrder(2);
      const originalPurchaseOrder = await engine.purchaseOrder.findById(id);
      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a processing order",
        status: "processing",
      };
      await engine.purchaseOrder.update(id, data);
      const updatedRecord = await engine.purchaseOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalPurchaseOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(originalPurchaseOrder.status);
    });
    it("should only able to update remarks on cancelled purchase order", async () => {
      const id = idGenerator.purchaseOrder(3);
      const originalPurchaseOrder = await engine.purchaseOrder.findById(id);
      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a cancelled order",
        status: "cancelled",
      };
      await engine.purchaseOrder.update(id, data);
      const updatedRecord = await engine.purchaseOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalPurchaseOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(originalPurchaseOrder.status);
    });
    it("should only able to update remarks on deleted purchase order", async () => {
      const id = idGenerator.purchaseOrder(50);
      const originalPurchaseOrder = await engine.purchaseOrder.findById(id);
      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a deleted order",
        status: "deleted",
      };
      await engine.purchaseOrder.update(id, data);
      const updatedRecord = await engine.purchaseOrder.findById(id);
      expect(updatedRecord.date).toStrictEqual(originalPurchaseOrder.date);
      expect(updatedRecord.remarks).toStrictEqual(data.remarks);
      expect(updatedRecord.status).toStrictEqual(originalPurchaseOrder.status);
    });

    it("should throw PurchaseOrderInvalidStatusException when updating status on completed purchase order", async () => {
      const id = idGenerator.purchaseOrder(1);

      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a completed order",
        status: "draft",
      };
      await expect(engine.purchaseOrder.update(id, data)).rejects.toThrow(
        PurchaseOrderInvalidStatusException
      );
    });
    it("should throw PurchaseOrderInvalidStatusException when updating status on processing purchase order", async () => {
      const id = idGenerator.purchaseOrder(2);

      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a processing order",
        status: "draft",
      };
      await expect(engine.purchaseOrder.update(id, data)).rejects.toThrow(
        PurchaseOrderInvalidStatusException
      );
    });
    it("should throw PurchaseOrderInvalidStatusException when updating status on cancelled purchase order", async () => {
      const id = idGenerator.purchaseOrder(3);

      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a cancelled order",
        status: "draft",
      };
      await expect(engine.purchaseOrder.update(id, data)).rejects.toThrow(
        PurchaseOrderInvalidStatusException
      );
    });
    it("should throw PurchaseOrderInvalidStatusException when updating status on deleted purchase order", async () => {
      const id = idGenerator.purchaseOrder(50);

      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Trying to update a deleted order",
        status: "draft",
      };
      await expect(engine.purchaseOrder.update(id, data)).rejects.toThrow(
        PurchaseOrderInvalidStatusException
      );
    });
    it("should throw PurchaseOrderNotFound for non-existent order", async () => {
      const id = idGenerator.purchaseOrder(199);
      const data: PurchaseOrderUpdateAttributes = {
        remarks: "Trying to update a completed order",
        status: "completed",
      };
      await expect(engine.purchaseOrder.update(id, data)).rejects.toThrow(
        PurchaseOrderNotFoundException
      );
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    it("should delete a purchase order", async () => {
      const result = await engine.purchaseOrder.delete(draftPurchaseOrderId);
      const record = await PurchaseOrder.findByPk(draftPurchaseOrderId, {
        paranoid: false,
      });
      expect(record).toBeDefined();
      expect(record?.status).toStrictEqual("deleted");
    });

    it("should throw PurchaseOrderInvalidStatusException for non-pending order", async () => {
      await expect(
        engine.purchaseOrder.delete(idGenerator.purchaseOrder(1))
      ).rejects.toThrow(PurchaseOrderInvalidStatusException);
    });
    it("should throw PurchaseOrderNotFound for non-existent order", async () => {
      const id = idGenerator.purchaseOrder(199);
      await expect(engine.purchaseOrder.delete(id)).rejects.toThrow(
        PurchaseOrderNotFoundException
      );
    });
  });

  describe("sync", () => {
    beforeEach(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });

    it("should add new items and update total correctly", async () => {
      const newItems: PurchaseOrderItemSyncAttributes[] = [
        {
          materialId: idGenerator.material(1),
          quantity: 10,
          unitPrice: 100,
          remarks: "New Item 1",
        },
        {
          materialId: idGenerator.material(2),
          quantity: 5,
          unitPrice: 200,
          remarks: "New Item 2",
        },
      ];

      await engine.purchaseOrder.sync(draftPurchaseOrderId, newItems);

      const updatedOrder = await PurchaseOrder.findByPk(draftPurchaseOrderId, {
        include: [PurchaseOrderItem],
      });
      expect(updatedOrder?.total).toBe(2000);
      expect(updatedOrder?.purchaseOrderItems).toHaveLength(2);

      const itemIds =
        updatedOrder?.purchaseOrderItems.map((item) => item.materialId) || [];
      expect(itemIds[0]).toStrictEqual(idGenerator.material(1));
      expect(itemIds[1]).toStrictEqual(idGenerator.material(2));
    });

    it("should update existing items without duplication", async () => {
      const existingItems: PurchaseOrderItemSyncAttributes[] = [
        {
          id: idGenerator.purchaseOrderItem(0, 0),
          materialId: idGenerator.material(1),
          quantity: 20,
          unitPrice: 150,
          remarks: "Updated Item",
        },
      ];

      await engine.purchaseOrder.sync(draftPurchaseOrderId, existingItems);

      const updatedOrder = await PurchaseOrder.findByPk(draftPurchaseOrderId, {
        include: [PurchaseOrderItem],
      });
      expect(updatedOrder?.purchaseOrderItems).toHaveLength(1);
      expect(updatedOrder?.purchaseOrderItems[0].quantity).toBe(20);
      expect(updatedOrder?.purchaseOrderItems[0].unitPrice).toBe(150);
    });

    it("should throw MaterialNotFoundException if any item has an invalid material ID", async () => {
      const invalidItems: PurchaseOrderItemSyncAttributes[] = [
        {
          materialId: "000000000000-0000-0000-000000000000",
          quantity: 5,
          unitPrice: 100,
          remarks: "Invalid Item",
        },
      ];
      await expect(
        engine.purchaseOrder.sync(draftPurchaseOrderId, invalidItems)
      ).rejects.toThrow(MaterialNotFoundException);
    });
  });

  describe("recalculateTotal", () => {
    beforeEach(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    it("should correctly calculate and update the total of a purchase order", async () => {
      const id = draftPurchaseOrderId;
      await engine.purchaseOrder.recalculateTotal(id);
      const updatedOrder = await PurchaseOrder.findByPk(id);

      expect(updatedOrder?.total).toStrictEqual(5000);
    });
  });

  describe("createInventory", () => {
    beforeEach(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });

    it("should create inventory and inventory flows when the purchase order is completed", async () => {
      await engine.purchaseOrder.createInventory(completedPurchaseOrderId);
      const purchaseOrderItems = await PurchaseOrderItem.findAll({
        where: {
          purchaseOrderId: completedPurchaseOrderId,
        },
        include: [
          {
            model: InventoryFlow,
            include: [
              {
                model: Inventory,
              },
            ],
          },
        ],
      });

      expect(purchaseOrderItems).toHaveLength(5); // Assuming each item generates one inventory flow
      for (const purchaseOrderItem of purchaseOrderItems) {
        expect(purchaseOrderItem.inventoryFlows).toHaveLength(1);
        expect(purchaseOrderItem.inventoryFlows[0].activity).toBe(
          "procurement"
        );
      }
    });

    it("should throw PurchaseOrderInvalidStatusException if the purchase order status is not completed", async () => {
      const id = draftPurchaseOrderId;
      await expect(engine.purchaseOrder.createInventory(id)).rejects.toThrow(
        PurchaseOrderInvalidStatusException
      );
    });
  });
});
