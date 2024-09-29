import { sessionController } from "~/controllers/session";

import { createRouter } from "@hyulian/express-api-contract";

import { getServerInfoController } from "./getServerInfo";
import { materialController } from "~/controllers/material";
import { enumController } from "~/controllers/enum";

export const controllers = createRouter((atlas) => {
  atlas.controller(getServerInfoController);
  atlas.router("enum", enumController);
  atlas.router("session", sessionController);
  atlas.router("material", materialController);
});
