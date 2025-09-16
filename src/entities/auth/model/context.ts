// src/entities/auth/model/context.ts
import { createContext } from "react";
import type { LoginInput, LoginSuccess } from "./types";

export type AuthUser = LoginSuccess["result"];

export type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
