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

  // 부트스트랩: 스냅샷 우선 반영 → 가능하면 조용히 리프레시
  useEffect(() => {
    (async () => {
      try {
        // 1) 로컬 스냅샷을 먼저 세팅 (새로고침 깜빡임 방지)
        const snap = loadUserSnapshot(); // 예: { accessToken?: string, ... }
        if (snap) {
          setUser(snap);
          if (snap.accessToken) {
            saveAccessToken(snap.accessToken);
            setAccessToken(snap.accessToken);
          }
        }

        // 2) 조용한 리프레시 시도(쿠키/조건 충족 시)
        //    실패해도 스냅샷은 그대로 두어 "로그아웃처럼 보이는 현상" 방지
        const at = await refreshSilently().catch(() => null);
        if (at) {
          saveAccessToken(at);
          setAccessToken(at);
          if (snap) {
            const next = { ...snap, accessToken: at };
            saveUserSnapshot(next);
            setUser(next);
          }
        }
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  // 브라우저 탭 간 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth:user") {
        const cached = loadUserSnapshot();
        setUser(cached);
        setAccessToken(cached?.accessToken ?? null);
      }
      if (e.key === "accessToken") {
        const at = localStorage.getItem("accessToken");
        setAccessToken(at);
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
      clearUserSnapshot();
      setAccessToken(null);
      setUser(null);
    }
  };

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

  if (!bootstrapped) return <div>인증 확인 중…</div>;
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
