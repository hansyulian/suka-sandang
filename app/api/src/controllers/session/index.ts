import { createRouter } from "@hyulian/express-api-contract";

import { emailLoginController } from "~/controllers/session/emailLogin";
import { getUserInfoController } from "~/controllers/session/getUserInfo";
import { updateUserInfoController } from "~/controllers/session/updateUserInfo";

export const sessionController = createRouter((atlas) => {
  atlas.controller(emailLoginController);
  atlas.controller(getUserInfoController);
  atlas.controller(updateUserInfoController);
});
