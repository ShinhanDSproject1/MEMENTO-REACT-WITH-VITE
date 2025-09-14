// vite.config.ts (root)
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import flowbiteReact from "flowbite-react/plugin/vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsconfigPaths from "vite-tsconfig-paths";

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const r = (p: string) => path.resolve(__dirname, p);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    flowbiteReact(),
    tsconfigPaths(), // tsconfig의 paths와 동기화
    mkcert(),
  ],
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
  server: {
    https: {
      key: fs.readFileSync("localhost-key.pem"),
      cert: fs.readFileSync("localhost.pem"),
    },
    host: true,
    port: 3000,
    // dev 서버 띄울 때 특정 경로로 열고 싶다면:
    open: "/memento-finance",
    proxy: {
      "/api": {
        target: "https://memento.shinhanacademy.co.kr",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  // GH Pages 같은 서브경로 배포 시 활성화(빌드 시 기준 경로)
  // base: "/memento-finance/",
  assetsInclude: ["**/*.mp4", "**/*.ttf"],
});
