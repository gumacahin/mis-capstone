import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@auth": path.resolve(__dirname, "./src/modules/auth"),
      "@auth/*": path.resolve(__dirname, "./src/modules/auth/*"),
      "@shared": path.resolve(__dirname, "./src/modules/shared"),
      "@shared/*": path.resolve(__dirname, "./src/modules/shared/*"),
      "@tasks": path.resolve(__dirname, "./src/modules/tasks"),
      "@tasks/*": path.resolve(__dirname, "./src/modules/tasks/*"),
      "@admin": path.resolve(__dirname, "./src/modules/admin"),
      "@admin/*": path.resolve(__dirname, "./src/modules/admin/*"),
      "@projects": path.resolve(__dirname, "./src/modules/projects"),
      "@projects/*": path.resolve(__dirname, "./src/modules/projects/*"),
      "@views": path.resolve(__dirname, "./src/modules/views"),
      "@views/*": path.resolve(__dirname, "./src/modules/views/*"),
      "@labels": path.resolve(__dirname, "./src/modules/labels"),
      "@labels/*": path.resolve(__dirname, "./src/modules/labels/*"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://127.0.0.1:8000/",
    },
  },
});
