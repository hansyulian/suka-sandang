import { createRouter } from "@hyulian/express-api-contract";
import { createSupplierController } from "~/controllers/supplier/createSupplier";
import { deleteSupplierController } from "~/controllers/supplier/deleteSupplier";
import { getSupplierController } from "~/controllers/supplier/getSupplier";
import { listSuppliersController } from "~/controllers/supplier/listSuppliers";
import { updateSupplierController } from "~/controllers/supplier/updateSupplier";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const supplierController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createSupplierController);
  atlas.controller(deleteSupplierController);
  atlas.controller(getSupplierController);
  atlas.controller(listSuppliersController);
  atlas.controller(updateSupplierController);
});
