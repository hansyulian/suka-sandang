import { Engine } from "~/CoreEngine";
import { idGenerator } from "~test/utils/idGenerator";
import { resetData } from "~test/utils/resetData";
import { salesOrderFixtures } from "~test/fixtures/salesOrderFixtures";
import { inventoryFixtures } from "~test/fixtures/inventoryFixtures";
import { customerFixtures } from "~test/fixtures/customerFixtures";
import {
  SalesOrderItemCreationAttributes,
  SalesOrderItemUpdateAttributes,
} from "@app/common";
import {
  InventoryInvalidStatusException,
  SalesOrderInvalidStatusException,
  SalesOrderItemNotFoundException,
} from "~/exceptions";
import { materialFixtures } from "~test/fixtures/materialFixtures";

describe("SalesOrderItemEngine", () => {
  const engine = new Engine();
  const draftSalesOrderId = idGenerator.salesOrder(0);
  const completedSalesOrderId = idGenerator.salesOrder(1);
  const finishedInventory = idGenerator.inventory(20);

  describe("list", () => {
    beforeAll(async () => {
      await resetData();
      await materialFixtures();
      await inventoryFixtures();
      await customerFixtures();
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
      await resetData();
      await materialFixtures();
      await inventoryFixtures();
      await customerFixtures();
      await salesOrderFixtures();
    });
    it("should create a new sales order item", async () => {
      const newItem: SalesOrderItemCreationAttributes = {
        salesOrderId: draftSalesOrderId,
        inventoryId: idGenerator.inventory(1),
        quantity: 10,
        unitPrice: 150,
        remarks: "New Item",
      };

      const createdItem = await engine.salesOrderItem.create(newItem);

      expect(createdItem).toHaveProperty("id");
      expect(createdItem.inventoryId).toStrictEqual(newItem.inventoryId);
      expect(createdItem.quantity).toStrictEqual(newItem.quantity);
      expect(createdItem.unitPrice).toStrictEqual(newItem.unitPrice);
      expect(createdItem.remarks).toStrictEqual(newItem.remarks);

      const updatedOrder = await engine.salesOrder.findById(draftSalesOrderId);
      expect(updatedOrder.total).toBe(4000);
      expect(updatedOrder.salesOrderItems).toHaveLength(6);
    });

    it("should throw SalesOrderInvalidStatusException for non-draft sales order", async () => {
      const newItem: SalesOrderItemCreationAttributes = {
        salesOrderId: completedSalesOrderId,
        inventoryId: idGenerator.inventory(1),
        quantity: 10,
        unitPrice: 150,
        remarks: "Invalid Item",
      };

      await expect(engine.salesOrderItem.create(newItem)).rejects.toThrow(
        SalesOrderInvalidStatusException
      );
    });

    it("should throw InventoryInvalidStatusException for inactive inventories", async () => {
      const newItem: SalesOrderItemCreationAttributes = {
        salesOrderId: draftSalesOrderId,
        inventoryId: finishedInventory, // Assuming this inventory is inactive
        quantity: 10,
        unitPrice: 150,
        remarks: "Invalid Inventory",
      };

      await expect(engine.salesOrderItem.create(newItem)).rejects.toThrow(
        InventoryInvalidStatusException
      );
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await resetData();
      await materialFixtures();
      await inventoryFixtures();
      await customerFixtures();
      await salesOrderFixtures();
    });
    it("should update an existing sales order item", async () => {
      const existingItemId = idGenerator.salesOrderItem(0, 0); // Assuming this item exists
      const updateData: SalesOrderItemUpdateAttributes = {
        inventoryId: idGenerator.inventory(2),
        quantity: 20,
        unitPrice: 300,
        remarks: "Updated Item",
      };

      const updatedItem = await engine.salesOrderItem.update(
        existingItemId,
        updateData
      );

      expect(updatedItem.inventoryId).toStrictEqual(updateData.inventoryId);
      expect(updatedItem.quantity).toStrictEqual(updateData.quantity);
      expect(updatedItem.unitPrice).toStrictEqual(updateData.unitPrice);
      expect(updatedItem.remarks).toStrictEqual(updateData.remarks);
    });

    it("should throw InventoryInvalidStatusException for inactive inventorys on update", async () => {
      const existingItemId = idGenerator.salesOrderItem(0, 0); // Assuming this item exists
      const updateData: SalesOrderItemUpdateAttributes = {
        inventoryId: finishedInventory, // Assuming this inventory is inactive
        quantity: 10,
        unitPrice: 150,
        remarks: "Invalid Update",
      };

      await expect(
        engine.salesOrderItem.update(existingItemId, updateData)
      ).rejects.toThrow(InventoryInvalidStatusException);
    });

    it("should throw SalesOrderItemNotFoundException for non-existent item", async () => {
      const nonExistentId = idGenerator.salesOrderItem(999, 999);

      const updateData: SalesOrderItemUpdateAttributes = {
        inventoryId: idGenerator.inventory(1),
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
      await resetData();
      await materialFixtures();
      await inventoryFixtures();
      await customerFixtures();
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
