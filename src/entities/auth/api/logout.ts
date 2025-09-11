import { http } from "@shared/api";
import type { LogoutSuccess } from "./types";

export async function logout(): Promise<LogoutSuccess> {
  const { data } = await http.post<LogoutSuccess>("/auth/logout");
  return data;
}
