// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import flowbiteReact from "flowbite-react/plugin/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const r = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact(), tsconfigPaths(), mkcert()],
  resolve: {
    alias: {
      "@": r("src"),
      "@app": r("src/app"),
      "@pages": r("src/pages"),
      "@widgets": r("src/widgets"),
      "@features": r("src/features"),
      "@entities": r("src/entities"),
      "@shared": r("src/shared"),
      "@assets": r("src/shared/assets"),
      "@hooks": r("src/shared/hooks"),
      "@lib": r("src/shared/lib"),
      "@ui": r("src/shared/ui"),
      "@api": r("src/shared/api"),
    },
  },
  define: {
    global: "window",
  },
  server: {
    https: {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost.pem"),
    },
    host: true,
    port: 3000,
    open: "/memento-finance",
    proxy: {
      "/api": {
        target: "https://memento.shinhanacademy.co.kr",
        changeOrigin: true,
        secure: true,
        cookieDomainRewrite: "localhost",
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const setCookie = proxyRes.headers["set-cookie"];
            if (!setCookie) return;

            const list = Array.isArray(setCookie) ? setCookie : [setCookie];
            proxyRes.headers["set-cookie"] = list.map((c) => {
              let v = c;
              v = v.replace(/;\s*SameSite=[^;]*/i, ""); // 기존 SameSite 제거
              if (!/;\s*Secure/i.test(v)) v += "; Secure";
              if (!/;\s*SameSite=/i.test(v)) v += "; SameSite=None";
              if (!/;\s*Path=/i.test(v)) v += "; Path=/";
              return v;
            });
          });
        },
      },

      "/ws/chat": {
        target: "wss://memento.shinhanacademy.co.kr",
        ws: true,
        changeOrigin: true,
        secure: true,
      },

      "/py": {
        target: "http://192.168.0.180:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/py/, ""), // ← 매개변수명 충돌 방지
      },

      "/ws-stomp": {
        target: "https://memento.shinhanacademy.co.kr",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
  assetsInclude: ["**/*.mp4", "**/*.ttf"],
});
