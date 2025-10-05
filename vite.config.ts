import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  plugins: [react()],
  server: {
    port: 5137, // можна змінити, якщо потрібно
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
  },
});
