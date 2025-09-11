import { http } from "@shared/api";
import type { RefreshSuccess } from "./types";

export async function refresh(token: string) {
  const { data } = await http.post<RefreshSuccess>("/auth/refresh", null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
