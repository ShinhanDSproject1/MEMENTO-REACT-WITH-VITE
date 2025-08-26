import { useState, useEffect } from "react";
import Splash from "../src/components/Splash";
import "./index.css"; // 반드시 먼저: @import "tailwindcss" 들어있어야 함
import "./app.css"; // 그 다음: 내가 만든 CSS (여기서 @apply 사용)
import MainHeader from "./components/MainHeader";
import { Outlet } from "react-router-dom";

function App() {
  const [showSplash, setShowSplash] = useState(true); // 스플래시 DOM 남김 여부
  const [fadeOut, setFadeOut] = useState(false); // 페이드 아웃 트리거

  useEffect(() => {
    // 1) 일정 시간 동안 스플래시 유지 (2초)
    const hold = setTimeout(() => setFadeOut(true), 2000);

    // 2) 페이드 아웃 애니메이션 후 스플래시 제거 (2.5초)
    const remove = setTimeout(() => setShowSplash(false), 2500);

    return () => {
      clearTimeout(hold);
      clearTimeout(remove);
    };
  }, []);

  // 스플래시 표시 중이면 스플래시만 렌더링
  if (showSplash) {
    return (
      <div
        className={`flex min-h-dvh items-center justify-center bg-[#f5f6f8] transition-opacity duration-1200 ease-out ${
          fadeOut ? "opacity-0" : "opacity-100"
        }`}>
        <Splash />
      </div>
    );
  }

  return (
    <div className="itmes-center mx-auto flex min-h-dvh flex-col bg-white lg:w-100">
      <div className="mx-auto flex min-h-dvh w-full flex-col">
        {/* ✅ 분리한 헤더 */}
        <MainHeader
          onClickLogin={() => console.log("login clicked")}
          onClickHome={() => console.log("home clicked")}
        />

        {/* 메인 컨테이너: 패딩·최대너비 반응형 */}
        <main className="mx-auto w-full flex-1 items-center">
          <Outlet />
        </main>

        <footer className="border-t bg-white">
          <div className="mx-auto w-full max-w-5xl px-4 py-3 text-xs text-gray-500 sm:px-6 sm:text-sm lg:px-8">
            © 2025
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;