// src/entities/auth/model/context.ts
import { createContext } from "react";
import type { LoginInput, LoginSuccess } from "./types";

/** 서버 응답의 result 그대로 씀 */
export type AuthUser = LoginSuccess["result"]; // { memberName, memberType, accessToken? }

export type AuthContextValue = {
  user: AuthUser | null; // 서버 응답 그대로
  accessToken: string | null; // 편의상 따로 들고 있음
  isAuthenticated: boolean; // 로그인 여부
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
