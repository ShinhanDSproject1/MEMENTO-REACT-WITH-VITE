import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App.jsx";
import { BrowserRouter } from "react-router-dom";
import SplashGate from "@/pages/home/SplashGate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

if (import.meta.env.DEV) {
  (async () => {
    try {
      const { worker } = await import("./mocks/browser");
      const swUrl = `${import.meta.env.BASE_URL}mockServiceWorker.js`;
      // dev에선 "/" + 파일명, prod에선 base + 파일명으로 안전
      await worker.start({
        serviceWorker: { url: swUrl },
        // onUnhandledRequest: "bypass", // (선택) 핸들러 없는 요청은 통과
      });
    } catch (e) {
      console.warn("[MSW] start skipped:", e);
    }
  })();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SplashGate>
        <BrowserRouter basename="/memento-finance">
          <App />
        </BrowserRouter>
      </SplashGate>
    </QueryClientProvider>
  </React.StrictMode>,
);
