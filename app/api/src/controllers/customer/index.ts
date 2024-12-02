import { createRouter } from "@hyulian/express-api-contract";
import { createCustomerController } from "~/controllers/customer/createCustomer";
import { deleteCustomerController } from "~/controllers/customer/deleteCustomer";
import { getCustomerController } from "~/controllers/customer/getCustomer";
import { getCustomerOptionsController } from "~/controllers/customer/getCustomerOptions";
import { listCustomersController } from "~/controllers/customer/listCustomers";
import { updateCustomerController } from "~/controllers/customer/updateCustomer";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const customerController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createCustomerController);
  atlas.controller(deleteCustomerController);
  atlas.controller(getCustomerController);
  atlas.controller(listCustomersController);
  atlas.controller(updateCustomerController);
  atlas.controller(getCustomerOptionsController);
});
