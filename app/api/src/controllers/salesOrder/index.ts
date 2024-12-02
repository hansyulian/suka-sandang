import { createRouter } from "@hyulian/express-api-contract";
import { createSalesOrderController } from "~/controllers/salesOrder/createSalesOrder";
import { deleteSalesOrderController } from "~/controllers/salesOrder/deleteSalesOrder";
import { getSalesOrderController } from "~/controllers/salesOrder/getSalesOrder";
import { listSalesOrdersController } from "~/controllers/salesOrder/listSalesOrders";
import { updateSalesOrderController } from "~/controllers/salesOrder/updateSalesOrder";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const salesOrderController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createSalesOrderController);
  atlas.controller(deleteSalesOrderController);
  atlas.controller(getSalesOrderController);
  atlas.controller(listSalesOrdersController);
  atlas.controller(updateSalesOrderController);
});
