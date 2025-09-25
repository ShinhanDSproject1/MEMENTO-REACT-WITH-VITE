// eslint.config.js
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig } from "eslint/config";
import globals from "globals";

export default defineConfig([
  { ignores: ["dist", "storybook-static", "node_modules"] },

  // ✅ 공통(브라우저) 규칙
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
    },
    rules: {
      // 기본 추천
      ...js.configs.recommended.rules,
      // TS 추천
      ...tseslint.configs.recommended.rules,
      // React 추천
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,

      // 팀 커스텀
      "no-console": "warn",
      "no-alert": "warn",
      "default-case": ["error", { commentPattern: "^skip\\sdefault" }],
      "no-const-assign": "error",
      "no-eval": "error",
      "no-var": "error",
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "react/jsx-no-target-blank": "off",
      "react/no-unknown-property": ["error", { ignore: ["css"] }],
      "react/jsx-pascal-case": "error",
      "react/jsx-no-undef": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/self-closing-comp": ["error", { component: true, html: true }],
      "react/prop-types": "warn",

      // ✅ any 규제 완화
      "@typescript-eslint/no-explicit-any": "off",

      // Prettier 연동
      "prettier/prettier": "error",
    },
  },

  // ✅ Node 환경 파일에 Node 글로벌(process 등) 허용
  {
    files: ["vite.config.*", "eslint.config.*", "*.config.*", "*.cjs", "scripts/**", "tooling/**"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: { ...globals.node }, // ← process, __dirname 등 허용
    },
  },

  // Prettier와 충돌하는 규칙 끔
  eslintConfigPrettier,
]);
