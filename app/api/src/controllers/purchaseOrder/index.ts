import { createRouter } from "@hyulian/express-api-contract";
import { createPurchaseOrderController } from "~/controllers/purchaseOrder/createPurchaseOrder";
import { deletePurchaseOrderController } from "~/controllers/purchaseOrder/deletePurchaseOrder";
import { getPurchaseOrderController } from "~/controllers/purchaseOrder/getPurchaseOrder";
import { listPurchaseOrdersController } from "~/controllers/purchaseOrder/listPurchaseOrders";
import { updatePurchaseOrderController } from "~/controllers/purchaseOrder/updatePurchaseOrder";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const purchaseOrderController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createPurchaseOrderController);
  atlas.controller(deletePurchaseOrderController);
  atlas.controller(getPurchaseOrderController);
  atlas.controller(listPurchaseOrdersController);
  atlas.controller(updatePurchaseOrderController);
});
