import { Engine } from "~/Engine";
import { inventoryFixtures } from "~test/fixtures/inventoryFixtures";
import { idGenerator } from "~test/utils/idGenerator";
import { resetData } from "~test/utils/resetData";
import { InventoryDuplicationException } from "~/exceptions/InventoryDuplicationException";
import { InventoryNotFoundException } from "~/exceptions/InventoryNotFoundException";
import { materialFixtures } from "~test/fixtures/materialFixtures";
import { purchaseOrderFixtures } from "~test/fixtures/purchaseOrderFixtures";
import { supplierFixtures } from "~test/fixtures/supplierFixtures";
import { Inventory, InventoryFlow } from "~/models";
import { InventoryFlowSyncAttributes } from "@app/common";

describe("InventoryEngine", () => {
  const engine = new Engine();
  const testInventoryId = idGenerator.inventory(10);

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
    it("should return a list of inventories", async () => {
      const result = await engine.inventory.list({}, { limit: 10, offset: 0 });
      expect(result.count).toBeGreaterThanOrEqual(50);
      expect(result.records).toHaveLength(10);
      expect(result.records[0].material).toBeDefined();
    });
  });

  describe("findById", () => {
    beforeAll(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should return an inventory by id", async () => {
      const result = await engine.inventory.findById(testInventoryId);
      expect(result).toBeDefined();
      expect(result.id).toBe(testInventoryId);
      expect(result.material).toBeDefined();
      expect(result.inventoryFlows).toHaveLength(2);
    });

    it("should throw InventoryNotFoundException for non-existent id", async () => {
      const nonExistentId = idGenerator.inventory(999);
      await expect(engine.inventory.findById(nonExistentId)).rejects.toThrow(
        InventoryNotFoundException
      );
    });
  });

  describe("findByIdOrCode", () => {
    beforeAll(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should return an inventory by id", async () => {
      const result = await engine.inventory.findByIdOrCode(testInventoryId);
      expect(result).toBeDefined();
      expect(result.id).toBe(testInventoryId);
      expect(result.material).toBeDefined();
      expect(result.inventoryFlows).toHaveLength(2);
    });

    it("should throw InventoryNotFoundException for non-existent code", async () => {
      await expect(
        engine.inventory.findByIdOrCode("invalid-code")
      ).rejects.toThrow(InventoryNotFoundException);
    });
  });

  describe("create", () => {
    beforeEach(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should create a new inventory", async () => {
      const data = {
        code: "inventory-new",
        materialId: idGenerator.material(1),
        remarks: "New Inventory",
      };
      const result = await engine.inventory.create(data);
      expect(result).toBeDefined();
      expect(result.code).toBe(data.code);
      expect(result.materialId).toBe(data.materialId);
    });

    it("should throw InventoryDuplicationException for duplicate code", async () => {
      const data = {
        code: "inventory-po0-0",
        materialId: idGenerator.material(0),
        remarks: "Duplicate Test Inventory",
      };
      await expect(engine.inventory.create(data)).rejects.toThrow(
        InventoryDuplicationException
      );
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should update an existing inventory", async () => {
      const data = { remarks: "Updated remarks" };
      const result = await engine.inventory.update(testInventoryId, data);
      expect(result).toBeDefined();
      expect(result.remarks).toBe(data.remarks);
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should delete an inventory", async () => {
      const inventory = await engine.inventory.findById(testInventoryId);
      expect(inventory.status).toStrictEqual("active");
      expect(inventory.deletedAt).toBeNull();
      await engine.inventory.delete(testInventoryId);
      const deletedInventory = await engine.inventory.findById(testInventoryId);
      expect(deletedInventory.status).toStrictEqual("deleted");
      expect(deletedInventory.deletedAt).toBeDefined();
    });
  });

  describe("recalculateTotal", () => {
    beforeAll(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });
    it("should recalculate total based on inventory flows", async () => {
      const initialInventory = await engine.inventory.findById(testInventoryId);
      expect(initialInventory.total).toBeGreaterThanOrEqual(0);

      await engine.inventory.recalculateTotal(testInventoryId);
      const updatedInventory = await engine.inventory.findById(testInventoryId);
      const expectedTotal = initialInventory.inventoryFlows.reduce(
        (sum, flow) => sum + flow.quantity,
        0
      );

      expect(updatedInventory.total).toBe(expectedTotal);
    });
  });

  describe("sync", () => {
    beforeEach(async () => {
      await resetData([Inventory, InventoryFlow]);
      await inventoryFixtures();
    });

    it("should delete left-only inventory flows with updatable activities", async () => {
      const testInventoryFlowId = idGenerator.inventoryFlow(2, 0);
      const inventoryId = idGenerator.inventory(1);
      const syncData: InventoryFlowSyncAttributes[] = [
        {
          id: testInventoryFlowId,
          activity: "adjustment",
          quantity: 5,
          remarks: "Existing sync",
        },
      ];
      await engine.inventory.sync(inventoryId, syncData);
      const updatedFlows = await InventoryFlow.findAll({
        where: { inventoryId },
      });

      expect(updatedFlows).toHaveLength(2);
      const procurementFlow = updatedFlows.find(
        (record) => record.activity === "procurement"
      );
      const adjustmentFlow = updatedFlows.find(
        (record) => record.activity === "adjustment"
      );
      expect(procurementFlow?.inventoryId).toStrictEqual(inventoryId);
      expect(adjustmentFlow?.quantity).toStrictEqual(5);
      const inventory = await Inventory.findByPk(idGenerator.inventory(1));
      expect(inventory?.total).toBe(25);
    });

    it("should ignore non-updatable activity when created", async () => {
      const inventoryId = idGenerator.inventory(1);
      const inventory = await engine.inventory.findById(inventoryId);
      const newFlow: InventoryFlowSyncAttributes = {
        activity: "sales",
        quantity: -10,
        remarks: "New sync flow",
      };

      await engine.inventory.sync(idGenerator.inventory(1), [
        ...inventory.inventoryFlows,
        newFlow,
      ]);

      const updatedFlows = await InventoryFlow.findAll({
        where: { inventoryId: idGenerator.inventory(1) },
      });
      const createdFlow = updatedFlows.find(
        (flow) => flow.activity === "sales"
      );

      expect(createdFlow).toBeUndefined();

      const udpatedInventory = await Inventory.findByPk(
        idGenerator.inventory(1)
      );
      expect(udpatedInventory?.total).toBe(14);
    });
  });
});
