import morgan from "morgan";

import { atlas } from "@hyulian/express-api-contract";

import { appConfig } from "./config";
import { controllers } from "./controllers";

const port = appConfig.app.port;

const app = atlas((atlas) => {
  atlas.use(morgan("combined"));
  atlas.router("/", controllers);
});
app.start(port);
