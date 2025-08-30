import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    // Do not change this timeout! We are testing component interactions!
    // it should not take too long to respond to the user's actions.
    testTimeout: 800,
    exclude: ["tests/e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        "tests/e2e/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared": path.resolve(__dirname, "./src/modules/shared"),
      "@auth": path.resolve(__dirname, "./src/modules/auth"),
      "@tasks": path.resolve(__dirname, "./src/modules/tasks"),
      "@projects": path.resolve(__dirname, "./src/modules/projects"),
      "@labels": path.resolve(__dirname, "./src/modules/labels"),
      "@views": path.resolve(__dirname, "./src/modules/views"),
      "@admin": path.resolve(__dirname, "./src/modules/admin"),
    },
  },
});
