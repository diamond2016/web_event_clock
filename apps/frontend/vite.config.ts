import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "#": resolve(__dirname, "./src"),
      "#/backend": resolve(__dirname, "/../backend/src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://0.0.0.0:3001",
      "/ws": {
        target: "ws://0.0.0.0:3001",
        ws: true,
      },
    },
  },
  build: {
    sourcemap: true,
  },
});

