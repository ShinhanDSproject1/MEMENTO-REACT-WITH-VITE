import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App.jsx";
import { BrowserRouter } from "react-router-dom";
import SplashGate from "@/pages/home/SplashGate";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SplashGate>
    <BrowserRouter basename="/memento-finance">
      <App />
    </BrowserRouter>
  </SplashGate>,
);
