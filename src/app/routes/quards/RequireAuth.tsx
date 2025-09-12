import { useAuth } from "@/app/providers/AuthProvider";
import type React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * 로그인된 사용자만 접근 가능하게 막는 가드
 * 인증 안돼 있으면 /login 으로 리다이렉트
 */
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 로그인 후 다시 돌아올 수 있도록 현재 경로를 state에 저장
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}
