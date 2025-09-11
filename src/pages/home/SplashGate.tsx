// src/components/SplashGateHome.tsx
import Splash from "@/widgets/common/Splash";
import { useEffect, useState, type ReactNode } from "react";

type SplashGateProps = {
  /** 스플래시 뒤에 보여줄 실제 페이지 */
  children?: ReactNode;
  /** 스플래시를 유지하는 시간(ms) */
  holdMs?: number;
  /** 페이드아웃 시간(ms) */
  fadeMs?: number;
};

const DEFAULT_HOLD_MS = 2000;
const DEFAULT_FADE_MS = 500;

export default function SplashGate({
  children,
  holdMs = DEFAULT_HOLD_MS,
  fadeMs = DEFAULT_FADE_MS,
}: SplashGateProps) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), holdMs);
    const t2 = setTimeout(() => setShow(false), holdMs + fadeMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [holdMs, fadeMs]);

  if (!show) return <>{children}</>;

  return (
    <div
      className={`flex min-h-dvh items-center justify-center bg-[#f5f6f8] transition-opacity ease-out ${
        fadeOut ? "opacity-0 duration-[500ms]" : "opacity-100 duration-[1200ms]"
      }`}>
      <Splash />
    </div>
  );
}
