// src/app/routes/layouts/AppLayout.tsx
import CommonHeader from "@/components/common/CommonHeader";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-100 rounded-xl bg-white">
      <CommonHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
