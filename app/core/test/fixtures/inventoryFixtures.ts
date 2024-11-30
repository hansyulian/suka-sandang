import {
  Inventory,
  InventoryFlow,
  InventoryFlowSequelizeCreationAttributes,
  InventorySequelizeCreationAttributes,
} from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function inventoryFixtures() {
  const inventoryParams: InventorySequelizeCreationAttributes[] = [];
  for (let i = 0; i < 50; i += 1) {
    inventoryParams.push({
      id: idGenerator.inventory(i),
      code: `inventory-${i}`,
      materialId: idGenerator.material(i),
      total: i === 1 ? 14 : 19,
      status: i === 20 ? "finished" : "active",
    });
  }
  await Inventory.bulkCreate(inventoryParams, { individualHooks: true });
  const inventoryFlowParams: InventoryFlowSequelizeCreationAttributes[] = [];
  for (let i = 0; i < 50; i += 1) {
    inventoryFlowParams.push({
      id: idGenerator.inventoryFlow(0, i),
      inventoryId: idGenerator.inventory(i),
      quantity: 20,
      activity: "procurement",
      remarks: `remarks-${i}`,
    });
    inventoryFlowParams.push({
      id: idGenerator.inventoryFlow(1, i),
      inventoryId: idGenerator.inventory(i),
      quantity: -1,
      activity: "adjustment",
      remarks: `adjustment-${i}`,
    });
  }
  inventoryFlowParams.push({
    id: idGenerator.inventoryFlow(2, 0),
    inventoryId: idGenerator.inventory(1),
    quantity: -5,
    activity: "adjustment",
    remarks: "adjustment due to damage",
  });
  await InventoryFlow.bulkCreate(inventoryFlowParams, {
    individualHooks: true,
  });
}
