import { Engine } from "~/CoreEngine";
import { idGenerator } from "~test/utils/idGenerator";
import { resetData } from "~test/utils/resetData";
import { salesOrderFixtures } from "~test/fixtures/salesOrderFixtures";
import { materialFixtures } from "~test/fixtures/materialFixtures";
import { customerFixtures } from "~test/fixtures/customerFixtures";
import { SalesOrder, SalesOrderItem } from "~/models";
import {
  SalesOrderItemCreationAttributes,
  SalesOrderItemUpdateAttributes,
} from "@app/common";
import {
  MaterialInvalidStatusException,
  SalesOrderInvalidStatusException,
  SalesOrderItemNotFoundException,
} from "~/exceptions";

describe("SalesOrderItemEngine", () => {
  const engine = new Engine();
  const draftSalesOrderId = idGenerator.salesOrder(0);
  const completedSalesOrderId = idGenerator.salesOrder(1);
  const draftMaterial = idGenerator.material(10);

  beforeAll(async () => {
    await resetData();
    await materialFixtures();
    await customerFixtures();
  });

  describe("list", () => {
    beforeAll(async () => {
      await resetData([SalesOrderItem, SalesOrder]);
      await salesOrderFixtures();
    });
    it("should return a list of sales order items", async () => {
      const result = await engine.salesOrderItem.list({}, { limit: 20 });
      expect(result.count).toStrictEqual(250);
      expect(result.records).toHaveLength(20);
    });

    it("should return a filtered list of sales order items by salesOrderId", async () => {
      const id = idGenerator.salesOrder(1);
      const result = await engine.salesOrderItem.list(
        { salesOrderId: id },
        { limit: 20 }
      );
      expect(result.count).toStrictEqual(5);
      expect(result.records).toHaveLength(5);
      result.records.forEach((record) => {
        expect(record.salesOrderId).toStrictEqual(id);
      });
    });
  });

  describe("create", () => {
    beforeEach(async () => {
      await resetData([SalesOrderItem, SalesOrder]);
      await salesOrderFixtures();
    });
    it("should create a new sales order item", async () => {
      const newItem: SalesOrderItemCreationAttributes = {
        salesOrderId: draftSalesOrderId,
        materialId: idGenerator.material(1),
        quantity: 10,
        unitPrice: 150,
        remarks: "New Item",
      };

      const createdItem = await engine.salesOrderItem.create(newItem);

      expect(createdItem).toHaveProperty("id");
      expect(createdItem.materialId).toStrictEqual(newItem.materialId);
      expect(createdItem.quantity).toStrictEqual(newItem.quantity);
      expect(createdItem.unitPrice).toStrictEqual(newItem.unitPrice);
      expect(createdItem.remarks).toStrictEqual(newItem.remarks);

      const updatedOrder = await engine.salesOrder.findById(draftSalesOrderId);
      expect(updatedOrder.total).toBe(6500);
      expect(updatedOrder.salesOrderItems).toHaveLength(6);
    });

    it("should throw SalesOrderInvalidStatusException for non-draft sales order", async () => {
      const newItem: SalesOrderItemCreationAttributes = {
        salesOrderId: completedSalesOrderId,
        materialId: idGenerator.material(1),
        quantity: 10,
        unitPrice: 150,
        remarks: "Invalid Item",
      };

      await expect(engine.salesOrderItem.create(newItem)).rejects.toThrow(
        SalesOrderInvalidStatusException
      );
    });

    it("should throw MaterialInvalidStatusException for inactive materials", async () => {
      const newItem: SalesOrderItemCreationAttributes = {
        salesOrderId: draftSalesOrderId,
        materialId: draftMaterial, // Assuming this material is inactive
        quantity: 10,
        unitPrice: 150,
        remarks: "Invalid Material",
      };

      await expect(engine.salesOrderItem.create(newItem)).rejects.toThrow(
        MaterialInvalidStatusException
      );
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await resetData([SalesOrderItem, SalesOrder]);
      await salesOrderFixtures();
    });
    it("should update an existing sales order item", async () => {
      const existingItemId = idGenerator.salesOrderItem(0, 0); // Assuming this item exists
      const updateData: SalesOrderItemUpdateAttributes = {
        materialId: idGenerator.material(2),
        quantity: 20,
        unitPrice: 300,
        remarks: "Updated Item",
      };

      const updatedItem = await engine.salesOrderItem.update(
        existingItemId,
        updateData
      );

      expect(updatedItem.materialId).toStrictEqual(updateData.materialId);
      expect(updatedItem.quantity).toStrictEqual(updateData.quantity);
      expect(updatedItem.unitPrice).toStrictEqual(updateData.unitPrice);
      expect(updatedItem.remarks).toStrictEqual(updateData.remarks);
    });

    it("should throw MaterialInvalidStatusException for inactive materials on update", async () => {
      const existingItemId = idGenerator.salesOrderItem(0, 0); // Assuming this item exists
      const updateData: SalesOrderItemUpdateAttributes = {
        materialId: draftMaterial, // Assuming this material is inactive
        quantity: 10,
        unitPrice: 150,
        remarks: "Invalid Update",
      };

      await expect(
        engine.salesOrderItem.update(existingItemId, updateData)
      ).rejects.toThrow(MaterialInvalidStatusException);
    });

    it("should throw SalesOrderItemNotFoundException for non-existent item", async () => {
      const nonExistentId = idGenerator.salesOrderItem(999, 999);

      const updateData: SalesOrderItemUpdateAttributes = {
        materialId: idGenerator.material(1),
        quantity: 5,
        unitPrice: 200,
        remarks: "Test non-existent item",
      };

      await expect(
        engine.salesOrderItem.update(nonExistentId, updateData)
      ).rejects.toThrow(SalesOrderItemNotFoundException);
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await resetData([SalesOrderItem, SalesOrder]);
      await salesOrderFixtures();
    });
    it("should delete an existing sales order item", async () => {
      const existingItemId = idGenerator.salesOrderItem(0, 0); // Assuming this item exists

      await engine.salesOrderItem.delete(existingItemId);

      await expect(
        engine.salesOrderItem.findById(existingItemId)
      ).rejects.toThrow(SalesOrderItemNotFoundException);

      const updatedOrder = await engine.salesOrder.findById(draftSalesOrderId);
      expect(updatedOrder.salesOrderItems).toHaveLength(4);
    });

    it("should throw SalesOrderInvalidStatusException for non-draft sales order on delete", async () => {
      const existingItemId = idGenerator.salesOrderItem(0, 1);

      await expect(
        engine.salesOrderItem.delete(existingItemId)
      ).rejects.toThrow(SalesOrderInvalidStatusException);
    });

    it("should throw SalesOrderItemNotFoundException for non-existent item on delete", async () => {
      const nonExistentId = idGenerator.salesOrderItem(999, 999);

      await expect(engine.salesOrderItem.delete(nonExistentId)).rejects.toThrow(
        SalesOrderItemNotFoundException
      );
    });
  });
});
