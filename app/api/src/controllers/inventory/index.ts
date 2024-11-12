import { createRouter } from "@hyulian/express-api-contract";
import { createInventoryController } from "~/controllers/inventory/createInventory";
import { deleteInventoryController } from "~/controllers/inventory/deleteInventory";
import { getInventoryController } from "~/controllers/inventory/getInventory";
import { listInventoriesController } from "~/controllers/inventory/listInventories";
import { syncInventoryFlowsController } from "~/controllers/inventory/syncInventoryFlows";
import { updateInventoryController } from "~/controllers/inventory/updateInventory";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const inventoryController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createInventoryController);
  atlas.controller(deleteInventoryController);
  atlas.controller(getInventoryController);
  atlas.controller(listInventoriesController);
  atlas.controller(updateInventoryController);
  atlas.controller(syncInventoryFlowsController);
});
