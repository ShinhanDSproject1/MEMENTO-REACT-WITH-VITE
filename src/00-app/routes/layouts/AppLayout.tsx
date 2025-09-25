// src/app/routes/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-100 rounded-xl bg-white">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
