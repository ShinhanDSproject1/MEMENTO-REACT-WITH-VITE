// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import flowbiteReact from "flowbite-react/plugin/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isProd = process.env.NODE_ENV === "production";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const r = (p: string) => path.resolve(__dirname, p);

// dev에서만 동적 import (Node 18+ 가정)
const mkcert = !isProd ? (await import("vite-plugin-mkcert")).default : undefined;

// dev https cert 안전 로딩
function devHttps() {
  if (isProd) return undefined;
  try {
    const key = fs.readFileSync("localhost-key.pem");
    const cert = fs.readFileSync("localhost.pem");
    return { key, cert };
  } catch {
    // 인증서가 없으면 http로 구동
    return undefined;
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    flowbiteReact(),
    tsconfigPaths(),
    ...(isProd ? [] : [mkcert!()]),
  ],
  resolve: {
    alias: {
      "@": r("src"),
      "@app": r("src/00-app"),
      "@pages": r("src/01-pages"),
      "@features": r("src/02-features"),
      "@widgets": r("src/03-widgets"),
      "@entities": r("src/04-entities"),
      "@shared": r("src/05-shared"),
      "@assets": r("src/05-shared/assets"),
      "@hooks": r("src/05-shared/hooks"),
      "@lib": r("src/05-shared/lib"),
      "@ui": r("src/05-shared/ui"),
      "@api": r("src/05-shared/api"),
    },
  },
  define: { global: "window" },
  server: {
    https: devHttps(),
    host: true,
    port: 3000,
    proxy: {
      // ✅ 1) 더 구체적인 규칙을 먼저: /api/ai/** → 192.168.0.180:8001
      "/api/ai": {
        target: "http://192.168.0.180:8001",
        changeOrigin: true,
        secure: false,
        // /api/ 를 제거해서 /api/ai/chatbot/1 → /ai/chatbot/1 로 전달
        rewrite: (p) => p.replace(/^\/api/, ""),
      },

      "/api": {
        target: "https://memento.shinhanacademy.co.kr",
        changeOrigin: true,
        secure: true, // 셀프사인이면 false
        cookieDomainRewrite: "localhost",
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const setCookie = proxyRes.headers["set-cookie"];
            if (!setCookie) return;
            const list = Array.isArray(setCookie) ? setCookie : [setCookie];
            proxyRes.headers["set-cookie"] = list.map((c) => {
              let v = c.replace(/;\s*SameSite=[^;]*/i, ""); // SameSite 제거 후
              if (!/;\s*Secure/i.test(v)) v += "; Secure";
              if (!/;\s*SameSite=/i.test(v)) v += "; SameSite=None";
              if (!/;\s*Path=/i.test(v)) v += "; Path=/";
              return v;
            });
          });
        },
      },
      "/py": {
        target: "http://192.168.0.180:8001",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/py/, ""),
      },
      "/ws-stomp": {
        target: "https://memento.shinhanacademy.co.kr",
        changeOrigin: true,
        secure: true, // 셀프사인이면 false
        ws: true,
      },
    },
  },
  assetsInclude: ["**/*.mp4", "**/*.ttf"],
});
