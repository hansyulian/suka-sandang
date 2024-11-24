import { createRouter } from "@hyulian/express-api-contract";
import { createInventoryController } from "~/controllers/inventory/createInventory";
import { deleteInventoryController } from "~/controllers/inventory/deleteInventory";
import { getInventoryController } from "~/controllers/inventory/getInventory";
import { getInventoryOptionsController } from "~/controllers/inventory/getInventoryOptions";
import { listInventoriesController } from "~/controllers/inventory/listInventories";
import { updateInventoryController } from "~/controllers/inventory/updateInventory";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const inventoryController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createInventoryController);
  atlas.controller(deleteInventoryController);
  atlas.controller(getInventoryController);
  atlas.controller(listInventoriesController);
  atlas.controller(updateInventoryController);
  atlas.controller(getInventoryOptionsController);
});
