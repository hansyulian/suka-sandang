import { createRouter } from "@hyulian/express-api-contract";
import { createPurchaseOrderItemController } from "~/controllers/purchaseOrderItem/createPurchaseOrderItem";
import { deletePurchaseOrderItemController } from "~/controllers/purchaseOrderItem/deletePurchaseOrderItem";
import { getPurchaseOrderItemController } from "~/controllers/purchaseOrderItem/getPurchaseOrderItem";
import { listPurchaseOrderItemsController } from "~/controllers/purchaseOrderItem/listPurchaseOrderItems";
import { updatePurchaseOrderItemController } from "~/controllers/purchaseOrderItem/updatePurchaseOrderItem";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const purchaseOrderItemController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createPurchaseOrderItemController);
  atlas.controller(deletePurchaseOrderItemController);
  atlas.controller(getPurchaseOrderItemController);
  atlas.controller(listPurchaseOrderItemsController);
  atlas.controller(updatePurchaseOrderItemController);
});
