// src/app/routes/layouts/AppLayout.tsx
import CommonHeader from "@/widgets/common/CommonHeader";
import { loadUserSnapshot } from "@shared/auth";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        const snap = loadUserSnapshot();
        if (!snap?.accessToken) {
          navigate("/login", { replace: true });
        }
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [navigate]);
  return (
    <div className="mx-auto min-h-screen w-full max-w-100 rounded-xl bg-white">
      <CommonHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
