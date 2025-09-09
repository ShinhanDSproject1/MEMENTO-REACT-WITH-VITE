// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";


export default defineConfig([
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020, // ECMAScript 2020 문법 지원
      // Choose only one environment to avoid global variable conflicts
      globals: { ...globals.browser },
      // If you need Node.js globals instead, use:
      // globals: { ...globals.node },
      parserOptions: {
        ecmaVersion: "latest", // ECMAScript 2020 문법 지원
        ecmaFeatures: { jsx: true }, // JSX 문법을 허용 (React에서 사용)
        sourceType: "module", // ECMAScript 모듈(ESM) 사용
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react, // React 관련 ESLint 규칙 적용
      "react-hooks": reactHooks, // React Hooks 관련 규칙 적용
      "react-refresh": reactRefresh, // React Fast Refresh 관련 규칙 적용 (개발 중 핫 리로드)
      prettier: prettierPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...js.configs.recommended.rules, // ESLint 기본 권장 규칙 적용
      ...react.configs.recommended.rules, // React 권장 규칙 적용
      ...react.configs["jsx-runtime"].rules, // JSX 런타임 관련 규칙 적용 (React 17+에서 JSX 필요 없음)
      ...reactHooks.configs.recommended.rules, // React Hooks 권장 규칙 적용
      "no-console": "warn", // "no-console" 규칙을 경고로 설정
      "no-alert": "warn", // "no-alert" 규칙을 경고로 설정 -> custom으로 ui제작
      "no-unused-vars": [
        // 미사용 변수 경고
        "warn",
        { ignoreRestSiblings: true, argsIgnorePattern: "^_+$" }, // rest 연산자 형제 무시, _ 시작 매개변수 무시
      ],
      "no-undef": "warn", // 👈 이 부분을 추가하거나 수정하세요
      "default-case": ["error", { commentPattern: "^skip\\sdefault" }], //switch문에 default문 넣기 or // skip default
      "no-const-assign": "error", //const는 불변
      "no-eval": "error", //eval 금지,
      "no-var": "error", //var 금지
      eqeqeq: ["warn", "smart"], //==보다 ===을 권장
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }], // 불필요한 Fragment 금지, 표현식은 허용
      // 보안상 위험: target="_blank" 사용 시 rel="noopener noreferrer" 미설정으로 인한 취약점이 발생할 수 있으므로, 반드시 필요한 경우에만 off 하세요.
      "react/jsx-no-target-blank": "off",
      "react/no-unknown-property": ["error", { ignore: ["css"] }], // 알 수 없는 속성 금지, css 속성은 허용 (CSS-in-JS)
      "react/jsx-pascal-case": "error", // 컴포넌트 이름 파스칼 케이스 강제
      "react/jsx-no-undef": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }], // React Fast Refresh 관련: 컴포넌트만 export하도록 경고
      "react/self-closing-comp": [
        "error",
        {
          component: true, // 내용 없는 컴포넌트는 자체 닫는 태그 사용
          html: true, // HTML 요소도 적용
        },
      ],
      "react/prop-types": "warn",
      "prettier/prettier": "error", // Prettier 규칙을 위반하면 ESLint에서 에러로 처리
    },
  },
  prettierConfig,
]);
