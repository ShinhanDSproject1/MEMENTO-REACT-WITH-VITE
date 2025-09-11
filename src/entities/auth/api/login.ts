import { http } from "@shared/api";
import type { LoginInput, LoginSuccess } from "./types";

export async function login(input: LoginInput): Promise<LoginSuccess> {
  const { userType, ...body } = input;
  const { data } = await http.post<LoginSuccess>(`/auth/login/${userType}`, body, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
