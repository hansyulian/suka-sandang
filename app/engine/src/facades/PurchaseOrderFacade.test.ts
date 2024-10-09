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
import { PurchaseOrder, PurchaseOrderItem } from "~/models";

describe("PurchaseOrderFacade", () => {
  const engine = new Engine();

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
      }
    });
  });

  describe("findById", () => {
    beforeAll(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
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
      const result = await engine.purchaseOrder.update(
        id,
        data as PurchaseOrderUpdateAttributes
      );
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
      const id = idGenerator.purchaseOrder(0);
      const result = await engine.purchaseOrder.delete(id);
      const record = await PurchaseOrder.findByPk(id, { paranoid: false });
      expect(record).toBeDefined();
      expect(record?.status).toStrictEqual("deleted");
    });

    it("should throw PurchaseOrderInvalidStatusException for non-pending order", async () => {
      const id = idGenerator.purchaseOrder(1);
      await expect(engine.purchaseOrder.delete(id)).rejects.toThrow(
        PurchaseOrderInvalidStatusException
      );
    });
    it("should throw PurchaseOrderNotFound for non-existent order", async () => {
      const id = idGenerator.purchaseOrder(199);
      await expect(engine.purchaseOrder.delete(id)).rejects.toThrow(
        PurchaseOrderNotFoundException
      );
    });
  });
});
