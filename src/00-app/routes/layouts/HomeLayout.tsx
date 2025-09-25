// src/app/routes/layouts/HomeLayout.tsx
import MainHeader from "@/03-widgets/main/mainHeader/MainHeader";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-100 rounded-xl bg-white">
      <MainHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
