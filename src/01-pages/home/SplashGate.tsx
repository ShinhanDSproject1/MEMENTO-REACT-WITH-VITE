// src/widgets/splash/SplashGate.tsx
import { Splash } from "@/03-widgets/common";
import React, { useEffect, useState } from "react";

const KEY = "app.splash.seen";
// 스플래시 자동 종료를 쓰지 않으면 0으로 두고, 버튼으로만 닫기.
// 자동 종료를 쓰고 싶다면 ms로 적절히 지정 (예: 1500)
const AUTO_CLOSE_MS = 0;

export default function SplashGate({ children }: { children: React.ReactNode }) {
  // 세션에서 본 적 있으면 스킵
  const [show, setShow] = useState(() => !sessionStorage.getItem(KEY));

  // 스크롤 락 (스플래시 보일 때만)
  useEffect(() => {
    if (!show) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevOverflow;
    };
  }, [show]);

  // 자동 종료 옵션 (원치 않으면 AUTO_CLOSE_MS=0 유지)
  useEffect(() => {
    if (!show || AUTO_CLOSE_MS <= 0) return;
    const t = setTimeout(() => {
      sessionStorage.setItem(KEY, "1");
      setShow(false);
    }, AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [show]);

  const handleDone = () => {
    sessionStorage.setItem(KEY, "1");
    setShow(false);
  };

  return (
    <>
      {/* children은 렌더는 하되, 스플래시 동안 포커스/상호작용 막기 */}
      <div aria-hidden={show} {...(show ? { inert: "" as unknown as boolean } : {})}>
        {children}
      </div>

      {show && (
        <div
          className="fixed inset-0 z-[1000] flex h-dvh w-dvw items-center justify-center bg-white"
          role="dialog"
          aria-modal="true">
          {/* Splash 컴포넌트는 자동 이동 끄고(onDone 버튼으로만 닫기) */}
          <Splash onDone={handleDone} autoAdvanceMs={0} />
        </div>
      )}
    </>
  );
}
