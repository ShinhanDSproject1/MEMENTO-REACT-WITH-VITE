// import SplashGate from "@/pages/home/SplashGate";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";
// const queryClient = new QueryClient();

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <SplashGate>
//         <BrowserRouter basename="/memento-finance">
//           <App />
//         </BrowserRouter>
//       </SplashGate>
//     </QueryClientProvider>
//   </React.StrictMode>
// );
// src/main.tsx
import App from "@/app/App";
import "@/app/styles/globals.css";
import React from "react";
import ReactDOM from "react-dom/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
