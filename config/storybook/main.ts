// config/storybook/main.ts
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../../src/**/*.stories.@(ts|tsx)"], // 위치는 프로젝트에 맞게
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-msw",
    // 필요하면 "@storybook/addon-a11y"
  ],
};
export default config;
