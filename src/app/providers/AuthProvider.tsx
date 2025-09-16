// src/app/providers/AuthProvider.tsx
import type { AuthContextValue, LoginInput } from "@entities/auth";
import { AuthContext, login as loginApi, logout as logoutApi } from "@entities/auth";
import { refreshSilently } from "@shared/api";
import {
  clearAccessToken,
  clearUserSnapshot,
  loadUserSnapshot,
  setAccessToken as saveAccessToken,
  saveUserSnapshot,
} from "@shared/auth";
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
        const at = await refreshSilently(); // AT 발급
        if (at) {
          saveAccessToken(at);
          setAccessToken(at);
          const cached = loadUserSnapshot();
          if (cached) setUser(cached);
        } else {
          clearAccessToken();
          clearUserSnapshot();
        }
      } catch {
        clearAccessToken();
        setAccessToken(null);
        setUser(null);
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  // * 브라우저 탭 간 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth:user") {
        const cached = loadUserSnapshot();
        setUser(cached);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = async (input: LoginInput) => {
    const dto = await loginApi(input);
    const result = dto.result;
    setUser(result);
    if (result.accessToken) {
      saveAccessToken(result.accessToken);
      setAccessToken(result.accessToken);
    }
    saveUserSnapshot(result);
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
