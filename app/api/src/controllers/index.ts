import { sessionController } from "~/controllers/session";

import { createRouter } from "@hyulian/express-api-contract";

import { getServerInfoController } from "./getServerInfo";
import { materialController } from "~/controllers/material";
import { enumController } from "~/controllers/enum";
import { supplierController } from "~/controllers/supplier";
import { customerController } from "~/controllers/customer";
import { purchaseOrderController } from "~/controllers/purchaseOrder";
import { purchaseOrderItemController } from "~/controllers/purchaseOrderItem";
import { inventoryController } from "~/controllers/inventory";
import { inventoryFlowController } from "~/controllers/inventoryFlow";

export const controllers = createRouter((atlas) => {
  atlas.controller(getServerInfoController);
  atlas.router("enum", enumController);
  atlas.router("session", sessionController);
  atlas.router("material", materialController);
  atlas.router("supplier", supplierController);
  atlas.router("customer", customerController);
  atlas.router("purchase-order", purchaseOrderController);
  atlas.router("purchase-order-item", purchaseOrderItemController);
  atlas.router("inventory", inventoryController);
  atlas.router("inventory-flow", inventoryFlowController);
});
