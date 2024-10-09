import { Engine } from "~/Engine";
import { idGenerator } from "~test/utils/idGenerator";
import { resetData } from "~test/utils/resetData";
import { purchaseOrderFixtures } from "~test/fixtures/purchaseOrderFixtures";
import { PurchaseOrderInvalidStatusException } from "~/exceptions/PurchaseOrderInvalidStatusException";
import { PurchaseOrderItemSyncAttributes } from "~/facades/PurchaseOrderItemFacade";
import { materialFixtures } from "~test/fixtures/materialFixtures";
import { supplierFixtures } from "~test/fixtures/supplierFixtures";
import { MaterialInvalidStatusException } from "~/exceptions/MaterialInvalidStatusException";
import { MaterialNotFoundException } from "~/exceptions";
import { PurchaseOrder, PurchaseOrderItem } from "~/models";
import { PurchaseOrderNotFoundException } from "~/exceptions/PurchaseOrderNotFoundException";
import {
  PurchaseOrderItemCreationAttributes,
  PurchaseOrderItemUpdateAttributes,
} from "@app/common";
import { PurchaseOrderItemNotFoundException } from "~/exceptions/PurchaseOrderItemNotFoundException";

describe("PurchaseOrderItemFacade", () => {
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
    it("should return a list of purchase order items", async () => {
      const result = await engine.purchaseOrderItem.list({}, { limit: 20 });
      expect(result.count).toStrictEqual(250);
      expect(result.records).toHaveLength(20);
    });

    it("should return a filtered list of purchase order items by purchaseOrderId", async () => {
      const id = idGenerator.purchaseOrder(1);
      const result = await engine.purchaseOrderItem.list(
        { purchaseOrderId: id },
        { limit: 20 }
      );
      expect(result.count).toStrictEqual(5);
      expect(result.records).toHaveLength(5);
      result.records.forEach((record) => {
        expect(record.purchaseOrderId).toStrictEqual(id);
      });
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

      await engine.purchaseOrderItem.sync(draftPurchaseOrderId, newItems);

      const updatedOrder = await engine.purchaseOrder.findById(
        draftPurchaseOrderId
      );
      expect(updatedOrder.total).toBe(2000);
      expect(updatedOrder.purchaseOrderItems).toHaveLength(2);

      const itemIds = updatedOrder.purchaseOrderItems.map(
        (item) => item.materialId
      );
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

      await engine.purchaseOrderItem.sync(draftPurchaseOrderId, existingItems);

      const updatedOrder = await engine.purchaseOrder.findById(
        draftPurchaseOrderId
      );
      expect(updatedOrder.total).toBe(3000);
      expect(updatedOrder.purchaseOrderItems).toHaveLength(1);
      expect(updatedOrder.purchaseOrderItems[0].materialId).toStrictEqual(
        idGenerator.material(5)
      );
      expect(updatedOrder.purchaseOrderItems[0].remarks).toStrictEqual(
        "Updated Item"
      );
      expect(updatedOrder.purchaseOrderItems[0].quantity).toStrictEqual(20);
      expect(updatedOrder.purchaseOrderItems[0].unitPrice).toStrictEqual(150);
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

      const beforeUpdate = await engine.purchaseOrder.findById(
        draftPurchaseOrderId
      );
      expect(beforeUpdate.purchaseOrderItems.length).toStrictEqual(5);
      await engine.purchaseOrderItem.sync(draftPurchaseOrderId, newItems);

      const updatedOrder = await engine.purchaseOrder.findById(
        draftPurchaseOrderId
      );
      expect(updatedOrder.purchaseOrderItems.length).toStrictEqual(1);
      expect(updatedOrder.purchaseOrderItems[0].materialId).toStrictEqual(
        idGenerator.material(2)
      );
      expect(updatedOrder.total).toBe(1500);
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
        engine.purchaseOrderItem.sync(completedPurchaseOrderId, newItems)
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
        engine.purchaseOrderItem.sync(draftPurchaseOrderId, invalidItems)
      ).rejects.toThrow(MaterialNotFoundException);

      const unchangedOrder = await engine.purchaseOrder.findById(
        draftPurchaseOrderId
      );
      expect(unchangedOrder.purchaseOrderItems).toHaveLength(5);
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
        engine.purchaseOrderItem.sync(draftPurchaseOrderId, newItems)
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
        engine.purchaseOrderItem.sync(nonExistentId, newItems)
      ).rejects.toThrow(PurchaseOrderNotFoundException);
    });
  });

  describe("create", () => {
    beforeEach(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    it("should create a new purchase order item", async () => {
      const newItem: PurchaseOrderItemCreationAttributes = {
        purchaseOrderId: draftPurchaseOrderId,
        materialId: idGenerator.material(1),
        quantity: 10,
        unitPrice: 150,
        remarks: "New Item",
      };

      const createdItem = await engine.purchaseOrderItem.create(newItem);

      expect(createdItem).toHaveProperty("id");
      expect(createdItem.materialId).toStrictEqual(newItem.materialId);
      expect(createdItem.quantity).toStrictEqual(newItem.quantity);
      expect(createdItem.unitPrice).toStrictEqual(newItem.unitPrice);
      expect(createdItem.remarks).toStrictEqual(newItem.remarks);

      const updatedOrder = await engine.purchaseOrder.findById(
        draftPurchaseOrderId
      );
      expect(updatedOrder.total).toBe(6500);
      expect(updatedOrder.purchaseOrderItems).toHaveLength(6);
    });

    it("should throw PurchaseOrderInvalidStatusException for non-draft purchase order", async () => {
      const newItem: PurchaseOrderItemCreationAttributes = {
        purchaseOrderId: completedPurchaseOrderId,
        materialId: idGenerator.material(1),
        quantity: 10,
        unitPrice: 150,
        remarks: "Invalid Item",
      };

      await expect(engine.purchaseOrderItem.create(newItem)).rejects.toThrow(
        PurchaseOrderInvalidStatusException
      );
    });

    it("should throw MaterialInvalidStatusException for inactive materials", async () => {
      const newItem: PurchaseOrderItemCreationAttributes = {
        purchaseOrderId: draftPurchaseOrderId,
        materialId: draftMaterial, // Assuming this material is inactive
        quantity: 10,
        unitPrice: 150,
        remarks: "Invalid Material",
      };

      await expect(engine.purchaseOrderItem.create(newItem)).rejects.toThrow(
        MaterialInvalidStatusException
      );
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    it("should update an existing purchase order item", async () => {
      const existingItemId = idGenerator.purchaseOrderItem(0, 0); // Assuming this item exists
      const updateData: PurchaseOrderItemUpdateAttributes = {
        materialId: idGenerator.material(2),
        quantity: 20,
        unitPrice: 300,
        remarks: "Updated Item",
      };

      const updatedItem = await engine.purchaseOrderItem.update(
        existingItemId,
        updateData
      );

      expect(updatedItem.materialId).toStrictEqual(updateData.materialId);
      expect(updatedItem.quantity).toStrictEqual(updateData.quantity);
      expect(updatedItem.unitPrice).toStrictEqual(updateData.unitPrice);
      expect(updatedItem.remarks).toStrictEqual(updateData.remarks);
    });

    it("should throw MaterialInvalidStatusException for inactive materials on update", async () => {
      const existingItemId = idGenerator.purchaseOrderItem(0, 0); // Assuming this item exists
      const updateData: PurchaseOrderItemUpdateAttributes = {
        materialId: draftMaterial, // Assuming this material is inactive
        quantity: 10,
        unitPrice: 150,
        remarks: "Invalid Update",
      };

      await expect(
        engine.purchaseOrderItem.update(existingItemId, updateData)
      ).rejects.toThrow(MaterialInvalidStatusException);
    });

    it("should throw PurchaseOrderItemNotFoundException for non-existent item", async () => {
      const nonExistentId = idGenerator.purchaseOrderItem(999, 999);

      const updateData: PurchaseOrderItemUpdateAttributes = {
        materialId: idGenerator.material(1),
        quantity: 5,
        unitPrice: 200,
        remarks: "Test non-existent item",
      };

      await expect(
        engine.purchaseOrderItem.update(nonExistentId, updateData)
      ).rejects.toThrow(PurchaseOrderItemNotFoundException);
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await resetData([PurchaseOrderItem, PurchaseOrder]);
      await purchaseOrderFixtures();
    });
    it("should delete an existing purchase order item", async () => {
      const existingItemId = idGenerator.purchaseOrderItem(0, 0); // Assuming this item exists

      await engine.purchaseOrderItem.delete(existingItemId);

      await expect(
        engine.purchaseOrderItem.findById(existingItemId)
      ).rejects.toThrow(PurchaseOrderItemNotFoundException);

      const updatedOrder = await engine.purchaseOrder.findById(
        draftPurchaseOrderId
      );
      expect(updatedOrder.purchaseOrderItems).toHaveLength(4);
    });

    it("should throw PurchaseOrderInvalidStatusException for non-draft purchase order on delete", async () => {
      const existingItemId = idGenerator.purchaseOrderItem(0, 1);

      await expect(
        engine.purchaseOrderItem.delete(existingItemId)
      ).rejects.toThrow(PurchaseOrderInvalidStatusException);
    });

    it("should throw PurchaseOrderItemNotFoundException for non-existent item on delete", async () => {
      const nonExistentId = idGenerator.purchaseOrderItem(999, 999);

      await expect(
        engine.purchaseOrderItem.delete(nonExistentId)
      ).rejects.toThrow(PurchaseOrderItemNotFoundException);
    });
  });
});
