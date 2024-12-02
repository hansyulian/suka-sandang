import { Engine } from "~/CoreEngine";
import { inventoryFixtures } from "~test/fixtures/inventoryFixtures";
import { purchaseOrderFixtures } from "~test/fixtures/purchaseOrderFixtures";
import { idGenerator } from "~test/utils/idGenerator";
import { resetData } from "~test/utils/resetData";
import { InventoryFlowInvalidActivityException } from "~/exceptions/InventoryFlowInvalidActivityException";
import { InventoryFlowInvalidQuantityException } from "~/exceptions/InventoryFlowInvalidQuantityException";
import { InventoryFlowNotFoundException } from "~/exceptions/InventoryFlowNotFoundException";
import { InventoryFlowCreationAttributes } from "@app/common";
import { Inventory, InventoryFlow } from "~/models";
import { materialFixtures } from "~test/fixtures/materialFixtures";
import { supplierFixtures } from "~test/fixtures/supplierFixtures";

describe("InventoryFlowEngine", () => {
  const engine = new Engine();
  const testInventoryFlowId = idGenerator.inventoryFlow(0, 10);
  const testUpdatableInventoryFlowId = idGenerator.inventoryFlow(2, 0);
  const testNonUpdatableFlowId = idGenerator.inventoryFlow(0, 1); // A flow with "procurement" activity

  beforeAll(async () => {
    await resetData();
    await materialFixtures();
    await supplierFixtures();
    await purchaseOrderFixtures();
  });

  describe("list", () => {
    beforeAll(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should return a list of inventory flows", async () => {
      const result = await engine.inventoryFlow.list(
        {},
        { limit: 10, offset: 0 }
      );
      expect(result.count).toBeGreaterThanOrEqual(101);
      expect(result.records).toHaveLength(10);
      expect(result.records[0].inventoryId).toBeDefined();
      expect(result.records[0].purchaseOrderItem).toBeDefined();
    });
  });

  describe("findById", () => {
    beforeAll(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should return an inventory flow by id", async () => {
      const result = await engine.inventoryFlow.findById(testInventoryFlowId);
      expect(result).toBeDefined();
      expect(result.id).toBe(testInventoryFlowId);
      expect(result.inventoryId).toBeDefined();
    });

    it("should throw InventoryFlowNotFoundException for non-existent id", async () => {
      const nonExistentId = idGenerator.inventoryFlow(0, 999);
      await expect(
        engine.inventoryFlow.findById(nonExistentId)
      ).rejects.toThrow(InventoryFlowNotFoundException);
    });
  });

  describe("create", () => {
    beforeEach(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should create a new inventory flow with sales activity", async () => {
      const data: InventoryFlowCreationAttributes = {
        inventoryId: idGenerator.inventory(10),
        quantity: 10,
        remarks: "New Flow",
        activity: "adjustment",
      };
      const result = await engine.inventoryFlow.create(data);
      expect(result).toBeDefined();
      expect(result.inventoryId).toBe(data.inventoryId);
      expect(result.activity).toBe("adjustment");
      const inventory = await Inventory.findByPk(idGenerator.inventory(10));
      expect(inventory?.total).toStrictEqual(29);
    });

    it("should throw InventoryFlowInvalidQuantityException for negative total quantity", async () => {
      const data: InventoryFlowCreationAttributes = {
        inventoryId: idGenerator.inventory(10),
        quantity: -100,
        remarks: "Invalid Quantity Flow",
        activity: "adjustment",
      };
      await expect(engine.inventoryFlow.create(data)).rejects.toThrow(
        InventoryFlowInvalidQuantityException
      );
      const inventory = await Inventory.findByPk(idGenerator.inventory(10));
      expect(inventory?.total).toStrictEqual(19);
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should update the quantity of an inventory flow with updatable activity", async () => {
      const data = { quantity: -10, remarks: "Updated remarks" };
      const result = await engine.inventoryFlow.update(
        testUpdatableInventoryFlowId,
        data
      );
      expect(result).toBeDefined();
      const updatedFlow = await engine.inventoryFlow.findById(
        testUpdatableInventoryFlowId
      );
      expect(updatedFlow.quantity).toBe(data.quantity);
      expect(updatedFlow.remarks).toBe(data.remarks);
      const inventory = await Inventory.findByPk(idGenerator.inventory(1));
      expect(inventory?.total).toStrictEqual(9);
    });

    it("should reject updates on inventory flows with non-updatable activity", async () => {
      const data = { quantity: 16, remarks: "Attempted update" };
      await expect(
        engine.inventoryFlow.update(testNonUpdatableFlowId, data)
      ).rejects.toThrow(InventoryFlowInvalidActivityException);

      const inventory = await Inventory.findByPk(idGenerator.inventory(1));
      expect(inventory?.total).toStrictEqual(14);
    });
    it("should accept updates on inventory flows with non-updatable activity but quantity not changing", async () => {
      const data = { quantity: 20, remarks: "Attempted update" };
      await engine.inventoryFlow.update(testNonUpdatableFlowId, data);

      const updatedFlow = await engine.inventoryFlow.findById(
        testNonUpdatableFlowId
      );
      expect(updatedFlow.quantity).toBe(data.quantity);
      expect(updatedFlow.remarks).toBe(data.remarks);

      const inventory = await Inventory.findByPk(idGenerator.inventory(1));
      expect(inventory?.total).toStrictEqual(14);
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should delete an inventory flow with an updatable activity", async () => {
      await engine.inventoryFlow.delete(testUpdatableInventoryFlowId);
      await expect(
        engine.inventoryFlow.findById(testUpdatableInventoryFlowId)
      ).rejects.toThrow(InventoryFlowNotFoundException);
      const inventory = await Inventory.findByPk(idGenerator.inventory(1));
      expect(inventory?.total).toStrictEqual(19);
    });

    it("should throw InventoryFlowInvalidActivityException when deleting non-updatable activity", async () => {
      await expect(
        engine.inventoryFlow.delete(testNonUpdatableFlowId)
      ).rejects.toThrow(InventoryFlowInvalidActivityException);
      const inventory = await Inventory.findByPk(idGenerator.inventory(1));
      expect(inventory?.total).toStrictEqual(14);
    });
  });
});
