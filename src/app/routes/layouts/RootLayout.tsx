// src/app/routes/layouts/RootLayout.tsx
import SplashGate from "@pages/home/SplashGate";
import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <SplashGate>
      <Outlet />
    </SplashGate>
  );
}
