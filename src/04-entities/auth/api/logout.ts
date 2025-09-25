import type { LogoutSuccess } from "@entities/auth";
import { http } from "@/05-shared/api";

export async function logout(): Promise<LogoutSuccess> {
  const { data } = await http.post<LogoutSuccess>("/auth/logout", null, {
    withCredentials: true,
  });
  return data;
}
