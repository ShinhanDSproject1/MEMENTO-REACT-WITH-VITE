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
    // mkcert가 만든 로컬 인증서를 사용해 https로 띄움
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
        // 서버가 도메인을 지정해 내려보내도 로컬에 저장되도록 치환
        cookieDomainRewrite: "localhost",
        // Set-Cookie에 Secure / SameSite=None을 강제로 붙여 브라우저가 버리지 않게 함
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const setCookie = proxyRes.headers["set-cookie"];
            if (!setCookie) return;

            const list = Array.isArray(setCookie) ? setCookie : [setCookie];
            proxyRes.headers["set-cookie"] = list.map((c) => {
              let v = c;

              // 기존 SameSite 제거(중복 방지) 후 우리가 다시 지정
              v = v.replace(/;\s*SameSite=[^;]*/i, "");
              // Secure 없으면 추가
              if (!/;\s*Secure/i.test(v)) v += "; Secure";
              // SameSite 없으면 None으로
              if (!/;\s*SameSite=/i.test(v)) v += "; SameSite=None";
              // Path 없으면 기본값
              if (!/;\s*Path=/i.test(v)) v += "; Path=/";

              return v;
            });
          });
        },
      },
      "/map": {
        target: "https://memento.shinhanacademy.co.kr",
        changeOrigin: true,
        secure: true,
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
