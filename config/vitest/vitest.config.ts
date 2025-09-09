// test/vitest.config.ts
import { defineConfig, defineProject } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    projects: [
      // (1) 일반 유닛/컴포넌트 테스트
      defineProject({
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./test/vitest.setup.ts"],
          include: ["src/**/*.test.{ts,tsx}"],
          exclude: ["src/**/*.stories.{ts,tsx}"],
        },
      }),

      // (2) Storybook 연계 테스트 (스토리 인덱싱은 main.ts의 stories 필드 사용)
      defineProject({
        plugins: [
          storybookTest({
            // ✅ 우리의 커스텀 configDir
            configDir: path.join(__dirname, "../config/storybook"),
          }),
        ],
        test: {
          name: "storybook",
          // 브라우저 모드 사용 중이면 playwright 설치 필요 (아래 참고)
          browser: {
            enabled: true,
            headless: true,
            provider: "playwright",
            instances: [{ browser: "chromium" }],
          },
          setupFiles: ["./test/vitest.storybook.setup.ts"],
          // ✅ include 설정 제거 (Storybook이 stories 필드를 사용)
          // include: ["src/**/*.stories.{ts,tsx}"], // ⛔️ 제거
          // exclude: ["**/*.mdx"], // 필요 시 main.ts 쪽에 stories로 관리
        },
      }),
    ],
  },
});
