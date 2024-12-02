import { createRouter } from "@hyulian/express-api-contract";
import { createSalesOrderItemController } from "~/controllers/salesOrderItem/createSalesOrderItem";
import { deleteSalesOrderItemController } from "~/controllers/salesOrderItem/deleteSalesOrderItem";
import { getSalesOrderItemController } from "~/controllers/salesOrderItem/getSalesOrderItem";
import { listSalesOrderItemsController } from "~/controllers/salesOrderItem/listSalesOrderItems";
import { updateSalesOrderItemController } from "~/controllers/salesOrderItem/updateSalesOrderItem";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const salesOrderItemController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createSalesOrderItemController);
  atlas.controller(deleteSalesOrderItemController);
  atlas.controller(getSalesOrderItemController);
  atlas.controller(listSalesOrderItemsController);
  atlas.controller(updateSalesOrderItemController);
});
