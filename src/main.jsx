import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App.jsx";
import { BrowserRouter } from "react-router-dom";
import SplashGate from "@/pages/home/SplashGate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

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
