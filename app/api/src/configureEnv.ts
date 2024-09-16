// hyulian: this file need to be executed as soon as possible before any other import
// so that the env configuration is handled right away
import { config } from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  const relativeRoot = "../../../";
  const envPath = path.resolve(__dirname, `${relativeRoot}.env`);
  console.log("Using env path: ", envPath);
  config({ path: envPath });
} else {
  config();
}
