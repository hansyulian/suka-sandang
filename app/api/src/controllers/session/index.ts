import { createRouter } from "@hyulian/express-api-contract";

import { emailLoginController } from "~/controllers/session/emailLogin";

export const sessionController = createRouter((atlas) => {
  atlas.controller(emailLoginController);
});
