// src/components/SplashGateHome.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Splash from "../../components/common/Splash";

const HOLD_MS = 2000; // 스플래시 유지
const FADE_MS = 500; // 페이드아웃

export default function SplashGate({ children }) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), HOLD_MS);
    const t2 = setTimeout(() => setShow(false), HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!show) return children;

  return (
    <div
      className={`flex min-h-dvh items-center justify-center bg-[#f5f6f8] transition-opacity ease-out ${
        fadeOut ? "opacity-0 duration-[500ms]" : "opacity-100 duration-[1200ms]"
      }`}>
      <Splash />
    </div>
  );
}

SplashGate.propTypes = {
  children: PropTypes.node,
};
