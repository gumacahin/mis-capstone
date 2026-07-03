import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const serverPort = Number(process.env.PORT ?? 3000);
const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET ?? "http://127.0.0.1:8000/";

function chunkForVendor(id: string) {
  if (!id.includes("node_modules")) {
    return undefined;
  }

  const normalizedId = id.split(path.sep).join("/");

  if (
    normalizedId.includes("/react-admin/") ||
    normalizedId.includes("/ra-core/") ||
    normalizedId.includes("/ra-input-rich-text/") ||
    normalizedId.includes("/ra-ui-materialui/")
  ) {
    return "vendor-admin";
  }

  if (
    normalizedId.includes("/@tiptap/") ||
    normalizedId.includes("/mui-tiptap/") ||
    normalizedId.includes("/prosemirror-")
  ) {
    return "vendor-editor";
  }

  if (
    normalizedId.includes("/@mui/x-date-pickers/") ||
    normalizedId.includes("/chrono-node/") ||
    normalizedId.includes("/dayjs/") ||
    normalizedId.includes("/rrule/")
  ) {
    return "vendor-dates";
  }

  if (
    normalizedId.includes("/@hello-pangea/dnd/") ||
    normalizedId.includes("/@dnd-kit/")
  ) {
    return "vendor-dnd";
  }

  if (normalizedId.includes("/@mui/icons-material/")) {
    return "vendor-mui-icons";
  }

  if (normalizedId.includes("/@emotion/") || normalizedId.includes("/@mui/")) {
    return "vendor-mui";
  }

  if (
    normalizedId.includes("/@auth0/") ||
    normalizedId.includes("/auth0-spa-js/")
  ) {
    return "vendor-auth";
  }

  if (
    normalizedId.includes("/@tanstack/") ||
    normalizedId.includes("/react-query/")
  ) {
    return "vendor-query";
  }

  if (
    normalizedId.includes("/react/") ||
    normalizedId.includes("/react-dom/") ||
    normalizedId.includes("/react-router") ||
    normalizedId.includes("/scheduler/")
  ) {
    return "vendor-react";
  }

  if (
    normalizedId.includes("/axios/") ||
    normalizedId.includes("/query-string/")
  ) {
    return "vendor-http";
  }

  if (normalizedId.includes("/lucide-react/")) {
    return "vendor-icons";
  }

  return undefined;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: serverPort,
    strictPort: true, // Fail if the selected port is occupied instead of trying next port
    proxy: {
      "/api": apiProxyTarget,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: chunkForVendor,
      },
    },
  },
});
