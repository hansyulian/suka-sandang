import dotenv from "dotenv";
import { resolve } from "path";
import { defineConfig } from "vite";
import commonjs from "vite-plugin-commonjs";

import react from "@vitejs/plugin-react";

dotenv.config({ path: resolve(__dirname, "../../.env") });
const apiPort = process.env.API_PORT;
console.log(`forwarding /api to localhost:${apiPort}`);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [commonjs(), react()],
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
