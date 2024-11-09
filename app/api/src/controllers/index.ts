import { sessionController } from "~/controllers/session";

import { createRouter } from "@hyulian/express-api-contract";

import { getServerInfoController } from "./getServerInfo";
import { materialController } from "~/controllers/material";
import { enumController } from "~/controllers/enum";
import { supplierController } from "~/controllers/supplier";
import { customerController } from "~/controllers/customer";
import { PurchaseOrderController } from "~/controllers/purchaseOrder";
import { PurchaseOrderItemController } from "~/controllers/purchaseOrderItem";
import { InventoryController } from "~/controllers/inventory";

export const controllers = createRouter((atlas) => {
  atlas.controller(getServerInfoController);
  atlas.router("enum", enumController);
  atlas.router("session", sessionController);
  atlas.router("material", materialController);
  atlas.router("supplier", supplierController);
  atlas.router("customer", customerController);
  atlas.router("purchase-order", PurchaseOrderController);
  atlas.router("purchase-order-item", PurchaseOrderItemController);
  atlas.router("inventory", InventoryController);
});
