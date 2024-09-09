import { createRouter } from "@hyulian/express-api-contract";

import { emailLoginController } from "~/controllers/session/emailLogin";
import { getUserInfoController } from "~/controllers/session/getUserInfo";
import { logoutController } from "~/controllers/session/logout";
import { updateUserInfoController } from "~/controllers/session/updateUserInfo";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const sessionController = createRouter((atlas) => {
  atlas.controller(emailLoginController);
  atlas.controller(logoutController);

  atlas.controller(getUserInfoController).middleware(authenticationMiddleware);
  atlas
    .controller(updateUserInfoController)
    .middleware(authenticationMiddleware);
});
