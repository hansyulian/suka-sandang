import { sessionController } from "~/controllers/session";

import { createRouter } from "@hyulian/express-api-contract";

import { customerController } from "~/controllers/customer";
import { enumController } from "~/controllers/enum";
import { getServerInfoController } from "./getServerInfo";
import { inventoryController } from "~/controllers/inventory";
import { inventoryFlowController } from "~/controllers/inventoryFlow";
import { materialController } from "~/controllers/material";
import { purchaseOrderController } from "~/controllers/purchaseOrder";
import { purchaseOrderItemController } from "~/controllers/purchaseOrderItem";
import { salesOrderController } from "~/controllers/salesOrder";
import { salesOrderItemController } from "~/controllers/salesOrderItem";
import { supplierController } from "~/controllers/supplier";

export const controllers = createRouter((atlas) => {
  atlas.controller(getServerInfoController);
  atlas.router("customer", customerController);
  atlas.router("enum", enumController);
  atlas.router("inventory-flow", inventoryFlowController);
  atlas.router("inventory", inventoryController);
  atlas.router("material", materialController);
  atlas.router("purchase-order-item", purchaseOrderItemController);
  atlas.router("purchase-order", purchaseOrderController);
  atlas.router("sales-order-item", salesOrderItemController);
  atlas.router("sales-order", salesOrderController);
  atlas.router("session", sessionController);
  atlas.router("supplier", supplierController);
});
