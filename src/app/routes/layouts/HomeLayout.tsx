// src/app/routes/layouts/HomeLayout.tsx
import { loadUserSnapshot } from "@/shared";
import MainHeader from "@/widgets/main/mainHeader/MainHeader";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function HomeLayout() {
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
      <MainHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
