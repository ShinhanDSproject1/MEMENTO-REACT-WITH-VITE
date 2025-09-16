import App from "@/app/App";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "1") {
//   // const { worker } = await import("@/mocks/browser");
//   await worker.start({
//     serviceWorker: { url: "/mockServiceWorker.js" },
//   });
//   console.info("[MSW] Mock API 활성화됨");
// }

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
