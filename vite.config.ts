import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const frappeUrl = env.VITE_FRAPPE_URL || "https://dev.galaxylabs.online";

  return {
    plugins: [react(), basicSsl()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },
    server: {
      port: 3000,
      host: "0.0.0.0",
      https: {},
      proxy: {
        "/api": {
          target: frappeUrl,
          changeOrigin: true,
          secure: false,
        },
        "/files": {
          target: frappeUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
