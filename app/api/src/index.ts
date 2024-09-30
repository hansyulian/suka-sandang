// hyulian: this file need to be executed as soon as possible before any other import
// so that the env configuration is handled right away
import "./configureEnv";
import { setupDatabase } from "@app/engine";
import { app } from "~/app";
import { appConfig } from "./config";

const port = appConfig.app.port;
async function init() {
  await setupDatabase();
  app.start(port);
}
init();
