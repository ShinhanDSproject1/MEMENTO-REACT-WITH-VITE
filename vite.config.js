import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },

  server: {
    host: "127.0.0.1", // localhost 강제
    port: 5173, // 5173 대신 3000
    strictPort: true, // 이미 쓰이면 실패하도록(자동변경 방지)
  },
});
