import type { LoginInput, LoginSuccess } from "@entities/auth";
import { login as loginApi, logout as logoutApi, refresh } from "@entities/auth";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextValue = {
  user: LoginSuccess["user"] | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  setAccessToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}

export default function AuthProvider({ children }: PropsWithChildren) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<LoginSuccess["user"] | null>(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await refresh();
        setAccessToken(res.accessToken);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  const login = async (input: LoginInput) => {
    const res = await loginApi(input);
    setAccessToken(res.accessToken);
    setUser(res.user);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
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
      setAccessToken,
    }),
    [user, accessToken],
  );

  if (!bootstrapped) {
    return <div>로딩 중…</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
