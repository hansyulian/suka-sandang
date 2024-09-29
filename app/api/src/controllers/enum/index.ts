import { createRouter } from "@hyulian/express-api-contract";
import { listEnumsController } from "~/controllers/enum/listEnums";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const enumController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);
  atlas.controller(listEnumsController);
});
