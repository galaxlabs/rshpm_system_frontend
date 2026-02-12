import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import tailwindcss from "@tailwindcss/vite";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const frappeUrl = env.VITE_FRAPPE_URL || "https://dev.galaxylabs.online";

  return {
    plugins: [
      react(), basicSsl(), tailwindcss()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
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
          configure(proxy) {
            proxy.on("proxyRes", (proxyRes) => {
              const setCookie = proxyRes.headers["set-cookie"];
              if (!setCookie) return;
              const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
              proxyRes.headers["set-cookie"] = cookies.map((cookie) =>
                cookie
                  .replace(/;\s*Secure/gi, "")
                  .replace(/;\s*Domain=[^;]+/gi, "")
              );
            });
          },
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
