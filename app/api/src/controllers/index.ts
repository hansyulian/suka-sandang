import { sessionController } from "~/controllers/session";

import { createRouter } from "@hyulian/express-api-contract";

import { getServerInfoController } from "./getServerInfo";

export const controllers = createRouter((atlas) => {
  atlas.controller(getServerInfoController);
  atlas.router("session", sessionController);
});
