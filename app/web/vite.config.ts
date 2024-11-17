import dotenv from "dotenv";
import { resolve } from "path";
import { defineConfig, UserConfig } from "vite";

import react from "@vitejs/plugin-react";

dotenv.config({ path: resolve(__dirname, "../../.env") });
const port = parseInt(process.env.WEB_PORT || "2781");
const apiPort = process.env.API_PORT;
const apiEndpoint = process.env.VITE_API_URL || "/api";
console.log(`forwarding /api to localhost:${apiPort}`);
// https://vitejs.dev/config/
const config: UserConfig = {
  base: "./",
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/_mantine";`,
      },
    },
  },
  resolve: {
    alias: [
      {
        find: "@app/(.*)$",
        replacement: resolve(__dirname, "../$1/dist"),
      },
      {
        find: "@hyulian/(.*)$",
        replacement: resolve(__dirname, "../../core/$1/dist"),
      },
      { find: "~", replacement: resolve(__dirname, "src") },
      { find: "~test", replacement: resolve(__dirname, "test") },
    ],
  },
  server: {
    port: port,
    host: "0.0.0.0",
    proxy: {
      [apiEndpoint]: {
        target: `http://localhost:${process.env.API_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(config as any).test = {
  environment: "jsdom", // Set jsdom as the test environment
  globals: true, // Enables Jest-like global methods like 'describe', 'it', etc.
  setupFiles: "./vitest.setup.js", // If you need a setup file (e.g., for Jest-DOM)
};
export default defineConfig(config);
