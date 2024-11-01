import { Engine } from "~/Engine";

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
import { PurchaseOrder, PurchaseOrderItem } from "~/models";
import { MaterialNotFoundException } from "~/exceptions";
import { MaterialInvalidStatusException } from "~/exceptions/MaterialInvalidStatusException";

describe("PurchaseOrderFacade", () => {
  const engine = new Engine();
  const draftPurchaseOrderId = idGenerator.purchaseOrder(0);
  const completedPurchaseOrderId = idGenerator.purchaseOrder(1);
  const draftMaterial = idGenerator.material(10);

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
    beforeEach(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
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
    beforeEach(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
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
    });

    it("should throw PurchaseOrderInvalidStatusException for non-pending status", async () => {
      const id = idGenerator.purchaseOrder(1);
      const data: PurchaseOrderUpdateAttributes = {
        remarks: "Trying to update a completed order",
        status: "completed",
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
    it("should sync purchase order items correctly by adding new items", async () => {
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

    it("should update existing purchase order items correctly", async () => {
      const existingItems: PurchaseOrderItemSyncAttributes[] = [
        {
          id: idGenerator.purchaseOrderItem(0, 0),
          materialId: idGenerator.material(5),
          quantity: 20,
          unitPrice: 150,
          remarks: "Updated Item",
        },
      ];

      await engine.purchaseOrder.sync(draftPurchaseOrderId, existingItems);

      const updatedOrder = await PurchaseOrder.findByPk(draftPurchaseOrderId, {
        include: [PurchaseOrderItem],
      });
      expect(updatedOrder?.total).toBe(3000);
      expect(updatedOrder?.purchaseOrderItems).toHaveLength(1);
      expect(updatedOrder?.purchaseOrderItems[0].materialId).toStrictEqual(
        idGenerator.material(5)
      );
      expect(updatedOrder?.purchaseOrderItems[0].remarks).toStrictEqual(
        "Updated Item"
      );
      expect(updatedOrder?.purchaseOrderItems[0].quantity).toStrictEqual(20);
      expect(updatedOrder?.purchaseOrderItems[0].unitPrice).toStrictEqual(150);
    });

    it("should delete items that are not in the new record set", async () => {
      const newItems: PurchaseOrderItemSyncAttributes[] = [
        {
          materialId: idGenerator.material(2),
          quantity: 15,
          unitPrice: 100,
          remarks: "Replacement Item",
        },
      ];

      const beforeUpdate = await PurchaseOrder.findByPk(draftPurchaseOrderId, {
        include: [PurchaseOrderItem],
      });
      expect(beforeUpdate?.purchaseOrderItems.length).toStrictEqual(5);
      await engine.purchaseOrder.sync(draftPurchaseOrderId, newItems);

      const updatedOrder = await PurchaseOrder.findByPk(draftPurchaseOrderId, {
        include: [PurchaseOrderItem],
      });
      expect(updatedOrder?.purchaseOrderItems.length).toStrictEqual(1);
      expect(updatedOrder?.purchaseOrderItems[0].materialId).toStrictEqual(
        idGenerator.material(2)
      );
      expect(updatedOrder?.total).toBe(1500);
    });

    it("should throw PurchaseOrderInvalidStatusException for non-draft status", async () => {
      const newItems: PurchaseOrderItemSyncAttributes[] = [
        {
          materialId: idGenerator.material(1),
          quantity: 5,
          unitPrice: 200,
          remarks: "Test invalid status",
        },
      ];

      await expect(
        engine.purchaseOrder.sync(completedPurchaseOrderId, newItems)
      ).rejects.toThrow(PurchaseOrderInvalidStatusException);
    });

    it("should prevent adding if the material doesn't exists", async () => {
      const invalidItems: PurchaseOrderItemSyncAttributes[] = [
        {
          materialId: idGenerator.material(999),
          quantity: 10,
          unitPrice: 100,
          remarks: "Invalid Item",
        },
      ];

      await expect(
        engine.purchaseOrder.sync(draftPurchaseOrderId, invalidItems)
      ).rejects.toThrow(MaterialNotFoundException);

      const unchangedOrder = await PurchaseOrder.findByPk(
        draftPurchaseOrderId,
        {
          include: [PurchaseOrderItem],
        }
      );
      expect(unchangedOrder?.purchaseOrderItems).toHaveLength(5);
    });

    it("should handle cases where material status isn't active", async () => {
      const newItems: PurchaseOrderItemSyncAttributes[] = [
        {
          materialId: draftMaterial,
          quantity: 5,
          unitPrice: 200,
          remarks: "Test inactive material",
        },
      ];

      await expect(
        engine.purchaseOrder.sync(draftPurchaseOrderId, newItems)
      ).rejects.toThrow(MaterialInvalidStatusException);
    });

    it("should handle cases where purchase order does not exist", async () => {
      const nonExistentId = idGenerator.purchaseOrder(999);
      const newItems: PurchaseOrderItemSyncAttributes[] = [
        {
          materialId: idGenerator.material(1),
          quantity: 5,
          unitPrice: 200,
          remarks: "Test non-existent purchase order",
        },
      ];

      await expect(
        engine.purchaseOrder.sync(nonExistentId, newItems)
      ).rejects.toThrow(PurchaseOrderNotFoundException);
    });
  });
});
