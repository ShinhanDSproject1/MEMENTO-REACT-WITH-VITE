// src/entities/auth/api/login.ts
import { http } from "@shared/api";
import type { LoginInput, LoginSuccess } from "../model/types";

export async function login(input: LoginInput): Promise<LoginSuccess> {
  const { data } = await http.post<LoginSuccess>(
    `/auth/login/${input.userType}`,
    { memberId: input.memberId, memberPwd: input.memberPwd },
    { headers: { "Content-Type": "application/json" } },
  );
  return data;
}
