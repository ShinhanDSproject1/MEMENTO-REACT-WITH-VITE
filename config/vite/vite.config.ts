import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import flowbiteReact from "flowbite-react/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import path from "node:path";
import { fileURLToPath } from "node:url";

// ESM에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    port: 3000,
    open: "/memento-finance",
  },
  // ⬇️ Vitest 전용 설정
  // test: {
  //   // Vite의 멀티 프로젝트 구성 (스토리북 테스트 전용)
  //   projects: [
  //     {
  //       extends: true,
  //       plugins: [
  //         storybookTest({
  //           configDir: path.join(__dirname, "config/storybook"),
  //         }),
  //       ],
  //       test: {
  //         name: "storybook",
  //         browser: {
  //           enabled: true,
  //           headless: true,
  //           provider: "playwright",
  //           instances: [{ browser: "chromium" }],
  //         },
  //         setupFiles: ["config/storybook/vitest.setup.ts"],
  //       },
  //     },
  //   ],
  // },
});
