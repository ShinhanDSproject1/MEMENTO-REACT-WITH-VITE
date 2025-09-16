// src/app/providers/AuthProvider.tsx
import { clearAccessToken, setAccessToken as saveAccessToken } from "@/shared/auth/token";
import type { AuthContextValue, LoginInput } from "@entities/auth";
import { AuthContext, login as loginApi, logout as logoutApi } from "@entities/auth";
import { refreshSilently } from "@shared/api"; // ✅ 이걸 사용
import React, { useEffect, useMemo, useState } from "react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    (async () => {
      const hasLocalAuth =
        !!localStorage.getItem("accessToken") || !!localStorage.getItem("memberSeq");
      if (!hasLocalAuth) {
        setBootstrapped(true);
        return;
      }
      try {
        const t = await refreshSilently(); // ✅ 인터셉터와 같은 Promise 공유
        if (t) {
          saveAccessToken(t);
          setAccessToken(t);
        } else {
          clearAccessToken();
        }
      } catch {
        clearAccessToken();
        setAccessToken(null);
        setUser(null);
      } finally {
        setBootstrapped(true); // 부트스트랩 끝나기 전엔 자식 렌더 X
      }
    })();
  }, []);

  const login = async (input: LoginInput) => {
    const dto = await loginApi(input);
    const result = dto.result;
    setUser(result);
    if (result.accessToken) {
      saveAccessToken(result.accessToken);
      setAccessToken(result.accessToken);
    }
  };

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
      isAuthenticated: !!accessToken,
      login,
      logout,
    }),
    [user, accessToken],
  );

  if (!bootstrapped) return <div>인증 확인 중…</div>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
