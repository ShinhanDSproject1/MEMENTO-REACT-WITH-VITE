// src/widgets/splash/SplashGate.tsx
import { Splash } from "@widgets/common";
import React, { useEffect, useState } from "react";

const KEY = "app.splash.seen";
const MIN_MS = 3000; // 최소 노출 시간

export default function SplashGate({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(() => !sessionStorage.getItem(KEY));

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      sessionStorage.setItem(KEY, "1");
      setShow(false);
    }, MIN_MS);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <>
      {show && <Splash />}
      {children}
    </>
  );
}
