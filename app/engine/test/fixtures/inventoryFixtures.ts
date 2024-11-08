import { Inventory, InventoryFlow } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function inventoryFixtures() {
  const promises = [];
  for (let i = 0; i < 50; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      const inventoryIdOffset = i * 5 + j;
      promises.push(
        Inventory.create({
          id: idGenerator.inventory(inventoryIdOffset),
          code: `inventory-po${i}-${j}`,
          materialId: idGenerator.material(j),
          total: 20,
        })
      );
    }
  }
  await Promise.all(promises);
  for (let i = 0; i < 50; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      const inventoryIdOffset = i * 5 + j;
      promises.push(
        InventoryFlow.create({
          id: idGenerator.inventoryFlow(0, inventoryIdOffset),
          inventoryId: idGenerator.inventory(inventoryIdOffset),
          quantity: 20,
          activity: "procurement",
          purchaseOrderItemId: idGenerator.purchaseOrderItem(j, i),
          remarks: `remarks-${i}-${j}`,
        })
      );
    }
  }
  await Promise.all(promises);
}
