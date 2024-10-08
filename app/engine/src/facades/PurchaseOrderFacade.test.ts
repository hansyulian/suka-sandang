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
  PurchaseOrderUpdateAttributes,
} from "@app/common";

describe("PurchaseOrderFacade", () => {
  const engine = new Engine();

  describe("list", () => {
    beforeAll(async () => {
      await resetData();
      await materialFixtures();
      await supplierFixtures();
      await purchaseOrderFixtures();
    });
    it("should return a list of purchase orders", async () => {
      const result = await engine.purchaseOrder.list(
        {},
        { limit: 10, offset: 0 }
      );
      expect(result.count).toBeGreaterThan(0);
      expect(result.records).toHaveLength(10);
    });
  });

  describe("findById", () => {
    beforeAll(async () => {
      await resetData();
      await materialFixtures();
      await supplierFixtures();
      await purchaseOrderFixtures();
    });
    it("should return a purchase order by id", async () => {
      const id = idGenerator.purchaseOrder(0);
      const result = await engine.purchaseOrder.findById(id);
      expect(result).toBeDefined();
      expect(result.id).toStrictEqual(id);
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
      await resetData();
      await materialFixtures();
      await supplierFixtures();
      await purchaseOrderFixtures();
    });
    it("should create a new purchase order", async () => {
      const data: PurchaseOrderCreationAttributes = {
        code: "PO-100",
        date: new Date(),
        supplierId: idGenerator.supplier(0),
        remarks: "Test Purchase Order",
        status: "pending",
        items: [
          {
            materialId: idGenerator.material(0),
            quantity: 10,
            unitPrice: 100,
            remarks: "Test item",
          },
        ],
      };
      const result = await engine.purchaseOrder.create(data);
      expect(result).toBeDefined();
      expect(result.code).toBe(data.code);
      expect(result.total).toBe(1000);
    });

    it("should throw PurchaseOrderDuplicationException for duplicate code", async () => {
      const data: PurchaseOrderCreationAttributes = {
        code: "PO-100",
        date: new Date(),
        supplierId: idGenerator.supplier(0),
        remarks: "Duplicate Test Purchase Order",
        status: "pending",
        items: [
          {
            materialId: idGenerator.material(0),
            quantity: 5,
            unitPrice: 200,
            remarks: "Test duplicate item",
          },
        ],
      };
      await expect(engine.purchaseOrder.create(data)).rejects.toThrow(
        PurchaseOrderDuplicationException
      );
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await resetData();
      await materialFixtures();
      await supplierFixtures();
      await purchaseOrderFixtures();
    });
    it("should update an existing purchase order", async () => {
      const id = idGenerator.purchaseOrder(0);
      const data: PurchaseOrderUpdateAttributes = {
        date: new Date(),
        remarks: "Updated remarks",
        status: "pending",
        items: [
          {
            id: idGenerator.purchaseOrderItem(0, 0),
            materialId: idGenerator.material(1),
            quantity: 15,
            unitPrice: 150,
            remarks: "Updated item",
          },
        ],
      };
      const result = await engine.purchaseOrder.update(id, data);
      expect(result).toBeDefined();
      expect(result.remarks).toBe(data.remarks);
      expect(result.total).toBe(2250);
    });

    it("should throw PurchaseOrderInvalidStatusException for non-pending status", async () => {
      const id = idGenerator.purchaseOrder(1);
      const data: PurchaseOrderUpdateAttributes = {
        remarks: "Trying to update a completed order",
        status: "completed",
        items: [],
      };
      await expect(engine.purchaseOrder.update(id, data)).rejects.toThrow(
        PurchaseOrderInvalidStatusException
      );
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await resetData();
      await materialFixtures();
      await supplierFixtures();
      await purchaseOrderFixtures();
    });
    it("should delete a purchase order", async () => {
      const id = idGenerator.purchaseOrder(2);
      const result = await engine.purchaseOrder.delete(id);
      expect(result).toEqual({ success: true });
    });

    it("should throw PurchaseOrderInvalidStatusException for non-pending order", async () => {
      const id = idGenerator.purchaseOrder(1);
      await expect(engine.purchaseOrder.delete(id)).rejects.toThrow(
        PurchaseOrderInvalidStatusException
      );
    });
  });
});
