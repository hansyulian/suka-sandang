import dotenv from "dotenv";
import { resolve } from "path";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

dotenv.config({ path: resolve(__dirname, "../../.env") });
const apiPort = process.env.API_PORT;
console.log(`forwarding /api to localhost:${apiPort}`);
// https://vitejs.dev/config/
export default defineConfig({
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
        find: "@app/common",
        replacement: resolve(__dirname, "../common/dist"),
      },
      {
        find: "@hyulian/common",
        replacement: resolve(__dirname, "../../core/common/dist"),
      },
      {
        find: "@hyulian/api-contract-client",
        replacement: resolve(__dirname, "../../core/api-contract-client/dist"),
      },
      {
        find: "@hyulian/react-api-contract-client",
        replacement: resolve(
          __dirname,
          "../../core/react-api-contract-client/dist"
        ),
      },
      { find: "~", replacement: resolve(__dirname, "src") },
    ],
  },
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${process.env.API_PORT}`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
