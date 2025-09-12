// src/app/providers/AuthProvider.tsx
import type { AuthContextValue, LoginInput, UserRole } from "@entities/auth";
import {
  AuthContext,
  login as loginApi,
  logout as logoutApi,
  refresh as refreshApi,
} from "@entities/auth";
import React, { useEffect, useMemo, useState } from "react";

// 개발 중 테스트 토큰 사용 여부
const USE_FAKE_TOKEN = true;

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  // 1) 앱 시작/새로고침 시 인증 부트스트랩
  useEffect(() => {
    (async () => {
      try {
        if (USE_FAKE_TOKEN) {
          const fake = {
            memberName: "테스트",
            memberType: "MENTI" as UserRole,
            accessToken: "dev-fake-access-token",
          };
          setUser(fake);
          setAccessToken(fake.accessToken ?? null);
          return;
        }

        // 실제: refresh 쿠키로 새 accessToken 받기
        const res = await refreshApi(); // { accessToken }
        setAccessToken(res.accessToken);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  // 2) 로그인 (서버 DTO 그대로 사용)
  const login = async (input: LoginInput) => {
    const dto = await loginApi(input); // LoginSuccess
    const result = dto.result; // { memberName, memberType, accessToken? }
    setUser(result);
    setAccessToken(result.accessToken ?? null);
    console.log("🔐 Auth state updated:", { user, accessToken });
  };

  // 3) 로그아웃
  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  // 4) Context value 메모
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!(accessToken ?? user?.accessToken),
      login,
      logout,
    }),
    [user, accessToken],
  );

  if (!bootstrapped) return <div>인증 확인 중...</div>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
