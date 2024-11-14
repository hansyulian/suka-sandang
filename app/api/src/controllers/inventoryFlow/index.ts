import { createRouter } from "@hyulian/express-api-contract";
import { createInventoryFlowController } from "~/controllers/inventoryFlow/createInventoryFlow";
import { deleteInventoryFlowController } from "~/controllers/inventoryFlow/deleteInventoryFlow";
import { getInventoryFlowController } from "~/controllers/inventoryFlow/getInventoryFlow";
import { listInventoryFlowsController } from "~/controllers/inventoryFlow/listInventoryFlows";
import { updateInventoryFlowController } from "~/controllers/inventoryFlow/updateInventoryFlow";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const inventoryFlowController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createInventoryFlowController);
  atlas.controller(deleteInventoryFlowController);
  atlas.controller(getInventoryFlowController);
  atlas.controller(listInventoryFlowsController);
  atlas.controller(updateInventoryFlowController);
});
