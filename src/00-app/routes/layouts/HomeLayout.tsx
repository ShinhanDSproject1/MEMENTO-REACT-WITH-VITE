// src/app/routes/layouts/HomeLayout.tsx
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-100 rounded-xl bg-white">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
