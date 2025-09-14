// src/app/providers/AuthProvider.tsx
import { clearAccessToken, setAccessToken as saveAccessToken } from "@/shared/auth/token";
import type { AuthContextValue, LoginInput } from "@entities/auth";
import {
  AuthContext,
  login as loginApi,
  logout as logoutApi,
  refresh as refreshApi,
} from "@entities/auth";
import React, { useEffect, useMemo, useState } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  // 앱 시작/새로고침 시: 로그인 페이지에서는 refresh 시도 금지
  useEffect(() => {
    const onLoginPage =
      typeof window !== "undefined" && window.location.pathname.startsWith("/login");

    (async () => {
      try {
        if (onLoginPage) {
          // 로그인 화면에서는 굳이 재인증(리프레시) 하지 않음
          setAccessToken(null);
          setUser(null);
          return;
        }

        // refresh 쿠키로 새 accessToken 받기
        const res = await refreshApi(); // { accessToken }
        saveAccessToken(res.accessToken); // 전역 저장 (인터셉터용)
        setAccessToken(res.accessToken);
      } catch {
        // 실패 시 클린업
        clearAccessToken();
        setAccessToken(null);
        setUser(null);
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  // 로그인: 서버 DTO 그대로 사용하되 토큰 전역/상태 동기화
  const login = async (input: LoginInput) => {
    const dto = await loginApi(input); // LoginSuccess
    const result = dto.result; // { memberName, memberType, accessToken? }
    setUser(result);

    if (result.accessToken) {
      saveAccessToken(result.accessToken);
      setAccessToken(result.accessToken);
    } else {
      // 서버가 AT를 바로 주지 않는 경우: 이후 요청에서 인터셉터가 refresh 처리
      setAccessToken(null);
    }
  };

  // 로그아웃: 서버 호출 후 항상 로컬 클린업
  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      clearAccessToken();
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!accessToken, // me 엔드포인트 없으니 토큰 기준
      login,
      logout,
    }),
    [user, accessToken],
  );

  if (!bootstrapped) return <div>인증 확인 중...</div>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
